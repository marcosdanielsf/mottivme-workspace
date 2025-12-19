#!/usr/bin/env python3
"""
Script para extrair transcrições de vídeos do YouTube
"""

import os
import json
import time
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter

# Lista de URLs dos vídeos
videos = [
    "https://www.youtube.com/watch?v=3J63Jpk-xwY",
    "https://www.youtube.com/watch?v=taY8hHR8Orw",
    "https://www.youtube.com/watch?v=m9jfKdMcOmI",
    "https://www.youtube.com/watch?v=jr-dLh36hDg",
    "https://www.youtube.com/watch?v=PF7zdTPCXoE",
    "https://www.youtube.com/watch?v=lWOls_jwmNE",
    "https://www.youtube.com/watch?v=v8XU7wNDju0",
    "https://www.youtube.com/watch?v=sM3xgxMw3FA",
    "https://www.youtube.com/watch?v=MgHhn3peezw",
    "https://www.youtube.com/watch?v=hvO2jy2fBP0",
    "https://www.youtube.com/watch?v=eu9neEAVK_4",
    "https://www.youtube.com/watch?v=cN2S26hmf0I",
    "https://www.youtube.com/watch?v=qpWmcLw5G5w",
    "https://www.youtube.com/watch?v=WBSVsltmWJE",
    "https://www.youtube.com/watch?v=VILNzg6QN_k",
    "https://www.youtube.com/watch?v=L2GC0ERenTk",
    "https://www.youtube.com/watch?v=JX8Y3eA2H2g",
    "https://www.youtube.com/watch?v=clKm3kkSAlU",
    "https://www.youtube.com/watch?v=B1dCarcOP80",
    "https://www.youtube.com/watch?v=3OR6sMC1dEY",
    "https://www.youtube.com/watch?v=y813lOz4M5U",
    "https://www.youtube.com/watch?v=Zm6-cJhAKLM",
    "https://www.youtube.com/watch?v=EfpHz1zCsWI",
    "https://www.youtube.com/watch?v=yq6b7A3jT0U",
    "https://www.youtube.com/watch?v=En5N1X6ksDk",
    "https://www.youtube.com/watch?v=4xmgtpXLUVw",
    "https://www.youtube.com/watch?v=5HzJ5-tvZOc",
    "https://www.youtube.com/watch?v=ZFdn5iwN9Cg",
    "https://www.youtube.com/watch?v=Ej8rdi-cwdw",
    "https://www.youtube.com/watch?v=Ej8rdi-cwdw&t=1s",
    "https://www.youtube.com/watch?v=Ej8rdi-cwdw&t=2s",
    "https://www.youtube.com/watch?v=Ej8rdi-cwdw&t=3s"
]

def extrair_video_id(url):
    """Extrai o ID do vídeo da URL do YouTube"""
    if "watch?v=" in url:
        return url.split("watch?v=")[1].split("&")[0]
    return None

def extrair_transcricao(video_id, idiomas=['pt', 'en']):
    """Extrai a transcrição de um vídeo do YouTube"""
    try:
        # Primeiro tenta obter transcrição nos idiomas preferidos
        for idioma in idiomas:
            try:
                api = YouTubeTranscriptApi()
                transcript = api.fetch(video_id, language_codes=[idioma])
                print(f"  ✓ Transcrição encontrada em {idioma}")
                return transcript, idioma, "disponivel"
            except Exception as e:
                continue
        
        # Se não encontrou nos idiomas preferidos, tenta qualquer idioma disponível
        try:
            api = YouTubeTranscriptApi()
            transcript = api.fetch(video_id)
            print(f"  ✓ Transcrição encontrada (idioma padrão)")
            return transcript, "auto", "disponivel"
        except Exception as e:
            print(f"  ✗ Erro: {str(e)}")
            return None, None, None
        
    except Exception as e:
        print(f"  ✗ Erro: {str(e)}")
        return None, None, None

def formatar_transcricao(transcript_data):
    """Formata a transcrição em texto legível"""
    if not transcript_data:
        return ""
    
    texto = ""
    for entry in transcript_data:
        # Se for um objeto FetchedTranscriptSnippet, usa o atributo text
        if hasattr(entry, 'text'):
            texto += entry.text + " "
        # Se for um dicionário, usa a chave 'text'
        elif isinstance(entry, dict) and 'text' in entry:
            texto += entry['text'] + " "
        # Caso contrário, converte para string
        else:
            texto += str(entry) + " "
    
    return texto.strip()

def salvar_transcricao(video_id, titulo, transcricao, idioma, tipo):
    """Salva a transcrição em um arquivo"""
    nome_arquivo = f"transcricao_{video_id}_{idioma}_{tipo}.txt"
    
    with open(nome_arquivo, 'w', encoding='utf-8') as f:
        f.write(f"Título: {titulo}\n")
        f.write(f"ID do Vídeo: {video_id}\n")
        f.write(f"Idioma: {idioma}\n")
        f.write(f"Tipo: {tipo}\n")
        f.write("=" * 50 + "\n\n")
        f.write(transcricao)
    
    return nome_arquivo

def main():
    """Função principal"""
    print("Iniciando extração de transcrições...")
    print(f"Total de vídeos: {len(videos)}")
    print("=" * 50)
    
    resultados = {
        "sucessos": [],
        "falhas": [],
        "total_videos": len(videos),
        "total_sucessos": 0,
        "total_falhas": 0
    }
    
    for i, url in enumerate(videos, 1):
        video_id = extrair_video_id(url)
        if not video_id:
            print(f"{i:2d}. URL inválida: {url}")
            resultados["falhas"].append({
                "url": url,
                "erro": "URL inválida"
            })
            continue
        
        print(f"{i:2d}. Processando vídeo: {video_id}")
        
        # Extrai a transcrição
        transcript_data, idioma, tipo = extrair_transcricao(video_id)
        
        if transcript_data:
            # Formata a transcrição
            transcricao = formatar_transcricao(transcript_data)
            
            # Salva a transcrição
            titulo = f"Video {video_id}"
            nome_arquivo = salvar_transcricao(video_id, titulo, transcricao, idioma, tipo)
            
            print(f"     Salvo em: {nome_arquivo}")
            print(f"     Tamanho: {len(transcricao)} caracteres")
            
            resultados["sucessos"].append({
                "url": url,
                "video_id": video_id,
                "idioma": idioma,
                "tipo": tipo,
                "arquivo": nome_arquivo,
                "tamanho": len(transcricao)
            })
            resultados["total_sucessos"] += 1
        else:
            print(f"     Nenhuma transcrição encontrada")
            resultados["falhas"].append({
                "url": url,
                "video_id": video_id,
                "erro": "Nenhuma transcrição encontrada"
            })
            resultados["total_falhas"] += 1
        
        print()
        
        # Delay para evitar rate limiting
        if i < len(videos):
            time.sleep(2)
    
    # Salva o relatório final
    with open("relatorio_final_transcricoes.json", 'w', encoding='utf-8') as f:
        json.dump(resultados, f, indent=2, ensure_ascii=False)
    
    print("=" * 50)
    print("RELATÓRIO FINAL:")
    print(f"Total de vídeos processados: {resultados['total_videos']}")
    print(f"Sucessos: {resultados['total_sucessos']}")
    print(f"Falhas: {resultados['total_falhas']}")
    print(f"Taxa de sucesso: {(resultados['total_sucessos']/resultados['total_videos']*100):.1f}%")
    print("\nRelatório detalhado salvo em: relatorio_final_transcricoes.json")

if __name__ == "__main__":
    main()