#!/usr/bin/env python3
"""
Script para tentar extrair transcrições dos vídeos que falharam anteriormente.
Usa delays maiores e diferentes estratégias para evitar rate limiting.
"""

import json
import time
import os
import sys
from urllib.parse import urlparse, parse_qs

# Importação da biblioteca YouTube Transcript API
# pylint: disable=import-error
try:
    from youtube_transcript_api import YouTubeTranscriptApi  # type: ignore
except ImportError as e:
    print(f"Erro: Biblioteca youtube_transcript_api não encontrada: {e}")
    print("Execute: pip install youtube-transcript-api")
    sys.exit(1)

def extrair_video_id(url):
    """Extrai o ID do vídeo de uma URL do YouTube"""
    if 'youtu.be/' in url:
        return url.split('youtu.be/')[-1].split('?')[0]
    elif 'youtube.com/watch' in url:
        parsed_url = urlparse(url)
        return parse_qs(parsed_url.query)['v'][0]
    else:
        return url

def formatar_transcricao(transcript_data):
    """Formata os dados da transcrição em texto legível"""
    texto_formatado = []
    for item in transcript_data:
        if hasattr(item, 'text'):
            texto_formatado.append(item.text)
        elif isinstance(item, dict) and 'text' in item:
            texto_formatado.append(item['text'])
        else:
            texto_formatado.append(str(item))
    
    return ' '.join(texto_formatado)

def tentar_extrair_transcricao(video_id, delay=10):
    """
    Tenta extrair transcrição de um vídeo com diferentes estratégias
    """
    print(f"Tentando extrair transcrição do vídeo: {video_id}")
    
    try:
        # Instanciar a API
        api = YouTubeTranscriptApi()
        
        # Estratégia 1: Tentar sem especificar idioma (automático)
        try:
            print("  Tentando extração automática...")
            transcript = api.fetch(video_id)
            if transcript:
                print("  ✅ Sucesso com extração automática")
                return {
                    'sucesso': True,
                    'transcript': transcript,
                    'idioma': 'auto',
                    'tipo': 'disponivel'
                }
        except Exception as e:
            print(f"  ❌ Falha com extração automática: {str(e)}")
        
        # Estratégia 2: Listar idiomas disponíveis e tentar cada um
        try:
            print("  Listando idiomas disponíveis...")
            transcript_list = api.list(video_id)
            
            # Converter para lista se necessário
            if hasattr(transcript_list, '__iter__'):
                for i, transcript_info in enumerate(transcript_list):
                    try:
                        if hasattr(transcript_info, 'language_code'):
                            idioma = transcript_info.language_code
                        else:
                            idioma = f'idioma_{i}'
                        
                        print(f"  Tentando idioma disponível: {idioma}")
                        
                        if hasattr(transcript_info, 'fetch'):
                            transcript = transcript_info.fetch()
                        else:
                            # Tentar fetch direto com o índice
                            transcript = api.fetch(video_id)
                        
                        if transcript:
                            print(f"  ✅ Sucesso com idioma: {idioma}")
                            return {
                                'sucesso': True,
                                'transcript': transcript,
                                'idioma': idioma,
                                'tipo': 'listado'
                            }
                    except Exception as e:
                        print(f"  ❌ Falha com idioma {idioma}: {str(e)}")
                        continue
            else:
                print("  Lista de transcrições não iterável")
                
        except Exception as e:
            print(f"  ❌ Falha ao listar idiomas: {str(e)}")
        
        # Estratégia 3: Tentar com delay maior e retry
        try:
            print(f"  Tentando novamente após delay de {delay} segundos...")
            time.sleep(delay)
            transcript = api.fetch(video_id)
            if transcript:
                print("  ✅ Sucesso após delay")
                return {
                    'sucesso': True,
                    'transcript': transcript,
                    'idioma': 'auto_retry',
                    'tipo': 'retry'
                }
        except Exception as e:
            print(f"  ❌ Falha após retry: {str(e)}")
        
        return {
            'sucesso': False,
            'erro': 'Nenhuma transcrição encontrada após todas as tentativas'
        }
        
    except Exception as e:
        return {
            'sucesso': False,
            'erro': f'Erro geral: {str(e)}'
        }

def main():
    # Lista dos vídeos que falharam (IDs únicos)
    videos_falharam = [
        'B1dCarcOP80',
        '3OR6sMC1dEY', 
        'y813lOz4M5U',
        'Zm6-cJhAKLM',
        'EfpHz1zCsWI',
        'yq6b7A3jT0U',
        'En5N1X6ksDk',
        '4xmgtpXLUVw',
        '5HzJ5-tvZOc',
        'ZFdn5iwN9Cg',
        'Ej8rdi-cwdw'  # Removendo duplicatas
    ]
    
    print(f"Tentando extrair transcrições de {len(videos_falharam)} vídeos que falharam anteriormente...")
    print("Usando delays maiores para evitar rate limiting...\n")
    
    sucessos_novos = []
    falhas_persistentes = []
    
    for i, video_id in enumerate(videos_falharam, 1):
        print(f"[{i}/{len(videos_falharam)}] Processando vídeo: {video_id}")
        
        # Delay progressivo (aumenta a cada tentativa)
        delay = 15 + (i * 2)  # 15s, 17s, 19s, etc.
        
        resultado = tentar_extrair_transcricao(video_id, delay)
        
        if resultado['sucesso']:
            # Salvar transcrição
            texto_formatado = formatar_transcricao(resultado['transcript'])
            
            nome_arquivo = f"transcricao_{video_id}_{resultado['idioma']}_{resultado['tipo']}.txt"
            
            with open(nome_arquivo, 'w', encoding='utf-8') as f:
                f.write(f"Título: Video {video_id}\n")
                f.write(f"ID do Vídeo: {video_id}\n")
                f.write(f"Idioma: {resultado['idioma']}\n")
                f.write(f"Tipo: {resultado['tipo']}\n")
                f.write(f"URL: https://www.youtube.com/watch?v={video_id}\n\n")
                f.write("=" * 50 + "\n")
                f.write("TRANSCRIÇÃO:\n")
                f.write("=" * 50 + "\n\n")
                f.write(texto_formatado)
            
            tamanho = len(texto_formatado.encode('utf-8'))
            
            sucessos_novos.append({
                'url': f'https://www.youtube.com/watch?v={video_id}',
                'video_id': video_id,
                'idioma': resultado['idioma'],
                'tipo': resultado['tipo'],
                'arquivo': nome_arquivo,
                'tamanho': tamanho
            })
            
            print(f"  ✅ Sucesso! Arquivo salvo: {nome_arquivo} ({tamanho} bytes)")
            
        else:
            falhas_persistentes.append({
                'url': f'https://www.youtube.com/watch?v={video_id}',
                'video_id': video_id,
                'erro': resultado['erro']
            })
            print(f"  ❌ Falha persistente: {resultado['erro']}")
        
        # Delay entre vídeos
        if i < len(videos_falharam):
            print(f"  Aguardando {delay} segundos antes do próximo vídeo...\n")
            time.sleep(delay)
    
    # Salvar relatório da segunda tentativa
    relatorio_segunda_tentativa = {
        'sucessos_novos': sucessos_novos,
        'falhas_persistentes': falhas_persistentes,
        'total_tentados': len(videos_falharam),
        'novos_sucessos': len(sucessos_novos),
        'falhas_restantes': len(falhas_persistentes),
        'taxa_sucesso_segunda_tentativa': (len(sucessos_novos) / len(videos_falharam)) * 100
    }
    
    with open('relatorio_segunda_tentativa.json', 'w', encoding='utf-8') as f:
        json.dump(relatorio_segunda_tentativa, f, ensure_ascii=False, indent=2)
    
    print("\n" + "="*60)
    print("RELATÓRIO DA SEGUNDA TENTATIVA")
    print("="*60)
    print(f"Vídeos tentados: {len(videos_falharam)}")
    print(f"Novos sucessos: {len(sucessos_novos)}")
    print(f"Falhas persistentes: {len(falhas_persistentes)}")
    print(f"Taxa de sucesso: {(len(sucessos_novos) / len(videos_falharam)) * 100:.1f}%")
    print(f"Relatório salvo em: relatorio_segunda_tentativa.json")

if __name__ == "__main__":
    main()