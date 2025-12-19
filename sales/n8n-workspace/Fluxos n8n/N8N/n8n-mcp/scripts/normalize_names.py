import argparse
import csv
import os
import sys
import unicodedata
import re
from typing import Optional

CONNECTORS = {"de", "da", "do", "das", "dos", "e"}
HONORIFICS_CANON = {
    "dr": "Dr.",
    "dra": "Dra.",
    "sr": "Sr.",
    "sra": "Sra.",
    "prof": "Prof.",
    "eng": "Eng.",
    "arq": "Arq.",
}
BR_DDDS = {
    "11","12","13","14","15","16","17","18","19",
    "21","22","24","27","28",
    "31","32","33","34","35","37","38",
    "41","42","43","44","45","46","47","48","49",
    "51","53","54","55",
    "61","62","63","64","65","66","67","68","69",
    "71","73","74","75","77","79",
    "81","82","83","84","85","86","87","88","89",
    "91","92","93","94","95","96","97","98","99",
}


def normalize_unicode(s: str) -> str:
    return unicodedata.normalize("NFC", s or "")


def title_token(token: str) -> str:
    t = token.lower()
    t_stripped = t.rstrip(".")
    if t_stripped in HONORIFICS_CANON:
        return HONORIFICS_CANON[t_stripped]
    if t in CONNECTORS:
        return t
    return t[:1].upper() + t[1:]


def normalize_word(word: str) -> str:
    if "-" in word:
        return "-".join(title_token(w) for w in word.split("-"))
    return title_token(word)


def normalize_name(name: str) -> str:
    name = normalize_unicode(name).strip()
    if not name:
        return ""
    parts = [normalize_word(p) for p in name.split()]
    if parts:
        parts[0] = parts[0][:1].upper() + parts[0][1:]
    return " ".join(parts)


def split_first_last(full_name: str):
    full_name = (full_name or "").strip()
    if not full_name:
        return "", ""
    tokens = full_name.split()
    if len(tokens) == 1:
        return tokens[0], ""
    # Build last name: include connector before last if present
    last_parts = [tokens[-1]]
    if len(tokens) >= 2 and tokens[-2].lower().rstrip(".") in CONNECTORS:
        last_parts.insert(0, tokens[-2])
        first_tokens = tokens[:-2]
    else:
        first_tokens = tokens[:-1]
    first = " ".join(first_tokens)
    last = " ".join(last_parts)
    return first, last


def process_row(row: dict, fieldnames: list[str]) -> dict:
    nome_completo = normalize_unicode(row.get("Nome Completo", "").strip())
    nome = normalize_unicode(row.get("Nome", "").strip())
    sobrenome = normalize_unicode(row.get("Sobrenome", "").strip())

    if not nome_completo and (nome or sobrenome):
        nome_completo = f"{nome} {sobrenome}".strip()
    nome_completo = normalize_name(nome_completo)

    if not sobrenome:
        first, last = split_first_last(nome_completo or nome)
        nome = normalize_name(first)
        sobrenome = normalize_name(last)
    else:
        nome = normalize_name(nome)
        sobrenome = normalize_name(sobrenome)

    out = dict(row)
    out["Nome"] = nome
    out["Sobrenome"] = sobrenome
    out["Nome Completo"] = f"{nome} {sobrenome}".strip()

    email = normalize_unicode(out.get("Email", "").strip())
    if email:
        out["Email"] = email.lower()

    tel = out.get("Telefone", "")
    ddd = out.get("DDD", "")
    tel_norm, ddd_norm = normalize_phone(ddd, tel)
    if tel_norm:
        out["Telefone"] = tel_norm
    if ddd_norm:
        out["DDD"] = ddd_norm

    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", default=None)
    parser.add_argument("--model", default=None)
    parser.add_argument("--phone-only", action="store_true")
    parser.add_argument("--phone-column", default="contactPhone")
    args = parser.parse_args()

    src = args.input
    if not os.path.exists(src):
        print(f"Arquivo não encontrado: {src}", file=sys.stderr)
        sys.exit(1)

    base, ext = os.path.splitext(src)
    dst = args.output or (base + ".clean" + (ext if ext else ".csv"))

    with open(src, "r", encoding="utf-8", newline="") as rf:
        reader = csv.reader(rf)
        rows = list(reader)
    if not rows:
        print("CSV vazio", file=sys.stderr)
        sys.exit(1)

    raw_header = [normalize_unicode(h).strip() for h in rows[0]]
    header = list(raw_header)
    data_rows = rows[1:]

    if "Nome" not in header:
        header.append("Nome")
    if "Sobrenome" not in header:
        header.append("Sobrenome")
    has_fullname = "Nome Completo" in raw_header

    idx_map = {h: i for i, h in enumerate(rows[0])}

    processed = []
    for r in data_rows:
        row = {}
        for h in rows[0]:
            i = idx_map[h]
            row[normalize_unicode(h).strip()] = normalize_unicode(r[i] if i < len(r) else "")
        out_row = process_row(row, header)
        # Normalize alternative phone columns if present
        alt_phone = out_row.get("contactPhone") or out_row.get("Phone") or out_row.get("phone") or out_row.get("Celular")
        if alt_phone and not out_row.get("Telefone"):
            e164, _ddd = normalize_phone(out_row.get("DDD", ""), alt_phone)
            if e164:
                out_row["Telefone"] = e164
        # Also ensure contactPhone reflects normalized value
        if out_row.get("Telefone"):
            out_row["contactPhone"] = out_row["Telefone"]
        processed.append(out_row)

    model_cols = None
    if args.model:
        with open(args.model, "r", encoding="utf-8", newline="") as mf:
            mreader = csv.reader(mf)
            mrows = list(mreader)
            if mrows:
                model_cols = [normalize_unicode(h).strip() for h in mrows[0]]

    if not model_cols:
        other_cols = [h for h in header if h not in {"Nome", "Sobrenome"}]
        target_header = ["Nome", "Sobrenome"] + other_cols
        if not has_fullname and "Nome Completo" in target_header:
            target_header = [h for h in target_header if h != "Nome Completo"]
    else:
        target_header = model_cols
    # If phone-only is requested, collapse to a single phone column
    if args.phone_only:
        collapse_cols = {"DDD", "Telefone", "Phone", "phone", "Celular", "contactPhone"}
        target_header = [h for h in target_header if h not in collapse_cols]
        # Ensure single phone column exists
        if args.phone_column not in target_header:
            target_header.append(args.phone_column)

    with open(dst, "w", encoding="utf-8", newline="") as wf:
        writer = csv.DictWriter(wf, fieldnames=target_header)
        writer.writeheader()
        for r in processed:
            if model_cols:
                mapped = map_to_model(r, model_cols)
                if args.phone_only:
                    # Set single phone column
                    phone_val = r.get("Telefone") or r.get("contactPhone") or r.get("Phone") or r.get("phone") or r.get("Celular") or ""
                    row_out = {h: mapped.get(h, "") for h in target_header}
                    row_out[args.phone_column] = phone_val
                    writer.writerow(row_out)
                else:
                    writer.writerow(mapped)
            else:
                base = {h: r.get(h, "") for h in header}
                if args.phone_only:
                    phone_val = r.get("Telefone") or r.get("contactPhone") or r.get("Phone") or r.get("phone") or r.get("Celular") or ""
                    row_out = {h: base.get(h, "") for h in target_header}
                    row_out[args.phone_column] = phone_val
                    writer.writerow(row_out)
                else:
                    writer.writerow(base)

    print(dst)


def digits_only(s: str) -> str:
    return re.sub(r"\D", "", s or "")

def detect_country(ddd: str, tel_digits: str, plus_cc: Optional[str]) -> str:
    if plus_cc:
        if plus_cc == "1":
            return "+1"
        return "+55" if plus_cc == "55" else f"+{plus_cc}"
    if ddd and ddd in BR_DDDS:
        return "+55"
    if ddd and len(ddd) == 3:
        return "+1"
    if len(tel_digits) == 11 and tel_digits.startswith("1"):
        return "+1"
    if len(tel_digits) in (10, 11) and tel_digits[:2] in BR_DDDS:
        return "+55"
    return "+55"

def format_e164(country: str, ddd: str, number: str) -> tuple[str, str]:
    if country == "+1":
        if len(number) == 11 and number.startswith("1"):
            number = number[1:]
        if len(ddd) == 0 and len(number) >= 10:
            ddd, number = number[:3], number[3:]
        elif len(ddd) == 3 and len(number) >= 7:
            number = number[-7:]
        return f"+1{ddd}{number}", ddd
    if country == "+55":
        if len(ddd) == 0 and len(number) >= 10:
            ddd, number = number[:2], number[2:]
        elif len(ddd) == 2 and len(number) >= 8:
            number = number[-9:] if len(number) >= 9 else number[-8:]
        return f"+55{ddd}{number}", ddd
    return f"{country}{ddd}{number}", ddd

def normalize_phone(ddd: str, tel: str) -> tuple[str, str]:
    raw = tel or ""
    plus_match = re.match(r"\s*\+(\d{1,3})", raw)
    plus_cc = plus_match.group(1) if plus_match else None
    ddd_digits = digits_only(ddd)
    tel_digits = digits_only(raw)
    if plus_cc and tel_digits.startswith(plus_cc):
        tel_digits = tel_digits[len(plus_cc):]
    if tel_digits.startswith("0"):
        tel_digits = tel_digits.lstrip("0")
    country = detect_country(ddd_digits, tel_digits, plus_cc)
    e164, ddd_final = format_e164(country, ddd_digits, tel_digits)
    return (e164 if e164.strip("+").isdigit() else ""), ddd_final

def country_name_from_phone(e164: str) -> str:
    if not e164:
        return ""
    if e164.startswith("+55"):
        return "Brazil"
    if e164.startswith("+1"):
        return "United States"
    return ""

def map_to_model(row: dict, model_cols: list[str]) -> dict:
    out = {}
    fn = row.get("Nome", "")
    ln = row.get("Sobrenome", "")
    email = row.get("Email", "")
    phone = row.get("Telefone", "")
    country = country_name_from_phone(phone)
    for col in model_cols:
        if col == "firstName":
            out[col] = fn
        elif col == "lastName":
            out[col] = ln
        elif col == "emailAddress":
            out[col] = email
        elif col == "contactPhone":
            out[col] = phone
        elif col == "countryName":
            out[col] = country
        elif col == "linkedin" and "linkedin" in row:
            out[col] = row.get("linkedin", "")
        elif col == "linkedInProfileUrl" and "linkedInProfileUrl" in row:
            out[col] = row.get("linkedInProfileUrl", "")
        elif col in row:
            out[col] = row.get(col, "")
        else:
            out[col] = ""
    return out

if __name__ == "__main__":
    main()
