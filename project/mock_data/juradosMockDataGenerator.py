import csv
import random

# List of possible professions
professions = [
    "Engenheiro", "Médico", "Professor", "Advogado", "Desenvolvedor", 
    "Designer", "Enfermeiro", "Contador", "Arquiteto", "Chef", 
    "Jornalista", "Policial", "Veterinário", "Psicólogo", "Fotógrafo", 
    "Músico", "Cientista", "Piloto", "Agricultor", "Outros"
]

# Function to generate fake names
def generate_fake_name():
    first_names = ["Ana", "Carlos", "Maria", "João", "Pedro", "Luísa", "Fernanda", "Rafael", "Gabriel", "Sofia"]
    last_names = ["Silva", "Santos", "Oliveira", "Souza", "Pereira", "Costa", "Rodrigues", "Almeida", "Lima", "Martins"]
    return f"{random.choice(first_names)} {random.choice(last_names)}"

# Generate the CSV file
with open('fake_data.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['número', 'nome', 'profissão'])  # Write header
    
    for i in range(1, 801):
        number = i
        name = generate_fake_name()
        # Randomly insert 'Outros' every 10-20 rows
        if i % random.randint(10, 20) == 0:
            profession = "Outros"
        else:
            profession = random.choice(professions)
        writer.writerow([number, name, profession])

print("CSV file 'fake_data.csv' generated successfully!")