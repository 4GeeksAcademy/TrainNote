import click
from sqlalchemy import text
from api.models import (
    db,
    Ejercicio,
    Usuario,
    Entrenamiento,
    DetalleEntrenamiento,
    Nutricion,
    Peso,
    PlanIA,
    CodigoRecuperacion,
)

ORDEN_TABLAS = [
    "DetalleEntrenamiento",
    "CodigoRecuperacion",
    "PlanIA",
    "Peso",
    "Nutricion",
    "Entrenamiento",
    "Ejercicio",
    "Usuario",
]

MODELOS_DISPONIBLES = {
    "Usuario": Usuario,
    "Ejercicio": Ejercicio,
    "Entrenamiento": Entrenamiento,
    "DetalleEntrenamiento": DetalleEntrenamiento,
    "Nutricion": Nutricion,
    "Peso": Peso,
    "PlanIA": PlanIA,
    "CodigoRecuperacion": CodigoRecuperacion,
}

COLUMNA_PK = {
    "Usuario": "UsuarioID",
    "Ejercicio": "EjercicioID",
    "Entrenamiento": "EntrenamientoID",
    "DetalleEntrenamiento": "DetEntrenamientoID",
    "Nutricion": "NutricionID",
    "Peso": "PesoID",
    "PlanIA": "PlanID",
    "CodigoRecuperacion": "RecuperacionID",
}


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

    @app.cli.command("clear-tables")
    @click.argument("tablas", nargs=-1)
    def clear_tables(tablas):
        """
        Borra los registros de las tablas indicadas.
        Uso:
          flask clear-tables Usuario
          flask clear-tables Entrenamiento DetalleEntrenamiento
          flask clear-tables            (borra TODAS las tablas)
        """
        nombres_tablas = list(tablas) if tablas else None

        if nombres_tablas is None:
            confirmar = input("¿Seguro que quieres borrar TODAS las tablas? (s/n): ")
            if confirmar.lower() != "s":
                print("Operación cancelada.")
                return
            nombres_tablas = ORDEN_TABLAS

        for nombre_tabla in nombres_tablas:
            modelo = MODELOS_DISPONIBLES.get(nombre_tabla)
            if modelo is None:
                print(f"Tabla '{nombre_tabla}' no reconocida. Saltando...")
                continue
            cantidad = modelo.query.delete()
            db.session.commit()
            print(f"Se borraron {cantidad} registros de {nombre_tabla}")

        print("¡Limpieza completa!")

    @app.cli.command("reset-autoincrement")
    @click.argument("tablas", nargs=-1)
    def reset_autoincrement(tablas):
        """
        Reinicia el autoincremento (ID) de las tablas indicadas a 1. (PostgreSQL)
        Uso:
          flask reset-autoincrement Usuario
          flask reset-autoincrement            (reinicia todas)
        """
        nombres_tablas = list(tablas) if tablas else ORDEN_TABLAS

        for nombre_tabla in nombres_tablas:
            columna_pk = COLUMNA_PK.get(nombre_tabla)
            if columna_pk is None:
                print(f"Tabla '{nombre_tabla}' no reconocida. Saltando...")
                continue
            try:
                nombre_secuencia = f'"{nombre_tabla}_{columna_pk}_seq"'
                db.session.execute(text(
                    f"ALTER SEQUENCE {nombre_secuencia} RESTART WITH 1"
                ))
                db.session.commit()
                print(f"Autoincremento reiniciado para {nombre_tabla}")
            except Exception as e:
                db.session.rollback()
                print(f"Error al reiniciar {nombre_tabla}: {e}")

        print("¡Reinicio de autoincremento completo!")

    @app.cli.command("reset-tables")
    @click.argument("tablas", nargs=-1)
    def reset_tables(tablas):
        """
        Borra registros Y reinicia autoincremento en un solo comando.
        Uso:
          flask reset-tables Usuario
          flask reset-tables            (resetea todas)
        """
        ctx = click.get_current_context()
        ctx.invoke(clear_tables, tablas=tablas)
        ctx.invoke(reset_autoincrement, tablas=tablas)