import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import os

PORT = 8000
DATA_FILE = "data.json"

class FinanceHandler(BaseHTTPRequestHandler):

    def _set_headers(self, content_type="application/json"):
        self.send_response(200)
        self.send_header("Content-type", content_type)
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/data":
            self._set_headers()
            with open(DATA_FILE, "r") as f:
                self.wfile.write(f.read().encode())
        else:
            if self.path == "/":
                self.path = "/static/index.html"
            try:
                with open("." + self.path, "rb") as file:
                    self._set_headers("text/html")
                    self.wfile.write(file.read())
            except:
                self.send_error(404)

    def do_POST(self):
        if self.path == "/api/data":
            content_length = int(self.headers["Content-Length"])
            post_data = self.rfile.read(content_length)

            with open(DATA_FILE, "w") as f:
                f.write(post_data.decode())

            self._set_headers()
            self.wfile.write(b'{"status": "success"}')

def run():
    server = HTTPServer(("localhost", PORT), FinanceHandler)
    print(f"Server läuft auf http://localhost:{PORT}")
    server.serve_forever()

if __name__ == "__main__":
    run()