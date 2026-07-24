import click
from api.models import db, Ejercicio

def setup_commands(app):
    @app.cli.command("insert-test-exercises")
    def insert_test_exercises():
        print("Creando ejercicios predeterminados...")
        nombres_ejercicios = [
            "Sentadilla con barra",
            "Press de banca",
            "Peso muerto",
            "Dominadas",
            "Press militar",
            "Remo con barra",
            "Prensa de piernas",
            "Zancadas con mancuernas",
            "Curl de bíceps con barra",
            "Extensión de tríceps en polea"
        ]
        
        for nombre in nombres_ejercicios:
            existente = Ejercicio.query.filter_by(nombre=nombre).first()
            if not existente:
                ejercicio = Ejercicio(nombre=nombre)
                db.session.add(ejercicio)
                db.session.commit()
                print(f"Ejercicio creado: {nombre}")
            else:
                print(f"El ejercicio ya existe: {nombre}")
        print("¡Ejercicios predeterminados listos!")