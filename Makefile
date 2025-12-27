.PHONY: start server run

# Iniciar el servidor
start: server

server:
	python server.py

run: server
