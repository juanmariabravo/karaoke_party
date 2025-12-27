#!/usr/bin/env python3
"""
Servidor simple para la aplicación de Karaoke
Ejecuta: python server.py
Luego abre: http://localhost:8000
"""

import http.server
import socketserver
import json
import os
from urllib.parse import urlparse, parse_qs

PORT = 8000

class KaraokeHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Servir archivos estáticos normalmente
        return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    def do_POST(self):
        # Manejar guardado de archivos JSON
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/save':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            filename = data.get('filename')
            content = data.get('content')
            
            if filename and content is not None:
                try:
                    with open(filename, 'w', encoding='utf-8') as f:
                        json.dump(content, f, ensure_ascii=False, indent=2)
                    
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': True}).encode())
                except Exception as e:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode())
            else:
                self.send_response(400)
                self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        # Manejar preflight requests de CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def end_headers(self):
        # Añadir headers CORS a todas las respuestas
        self.send_header('Access-Control-Allow-Origin', '*')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    Handler = KaraokeHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🎤 Servidor Karaoke ejecutándose en http://localhost:{PORT}")
        print(f"📁 Sirviendo archivos desde: {os.getcwd()}")
        print("⌨️  Presiona Ctrl+C para detener el servidor")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Servidor detenido")
