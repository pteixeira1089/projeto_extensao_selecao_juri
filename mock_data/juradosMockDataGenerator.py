import csv
import random
from datetime import datetime, timedelta
import unicodedata

# List of possible professions
professions = [
    "Engenheiro", "Médico", "Professor", "Advogado", "Desenvolvedor", 
    "Designer", "Enfermeiro", "Contador", "Arquiteto", "Chef", 
    "Jornalista", "Policial", "Veterinário", "Psicólogo", "Fotógrafo", 
    "Músico", "Cientista", "Piloto", "Agricultor", "Outros"
]

# List of possible scholarships
scholarships = [
    "Fundamental Incompleto", "Fundamental Completo", "Médio Incompleto",
    "Médio Completo", "Superior Incompleto", "Superior Completo", "Pós-graduação"
]

# List of possible genders
genders = ["Masculino", "Feminino", "Outro"]

# List of possible cities
cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre", "Salvador", "Brasília"]

first_names = ["Ana", "Carlos", "Maria", "João", "Pedro", "Luísa", "Fernanda", "Rafael", "Gabriel", "Sofia"]
last_names = ["Silva", "Santos", "Oliveira", "Souza", "Pereira", "Costa", "Rodrigues", "Almeida", "Lima", "Martins"]

# Function to generate fake names
def generate_fake_name():
    return f"{random.choice(first_names)} {random.choice(last_names)}"

# Function to generate social name
def generate_nome_social():
    # 1 in 80 chance
    return f"{random.choice(first_names)} {random.choice(last_names)}" if random.randint(1, 80) == 1 else ""

# Function to generate address
def generate_address():
    streets = ["Rua das Flores", "Avenida Brasil", "Rua da Paz", "Travessa Central", "Rua das Palmeiras", "Rua do Sol"]
    return f"{random.choice(streets)}, {random.randint(1, 999)}, {random.choice(cities)}"

# Function to generate CPF (Brazilian ID)
def generate_cpf():
    return "".join([str(random.randint(0, 9)) for _ in range(11)])

# Function to generate birthdate
def generate_birthdate():
    start_date = datetime(1950, 1, 1)
    end_date = datetime(2005, 12, 31)
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    birthdate = start_date + timedelta(days=random_days)
    return birthdate.strftime("%d/%m/%Y")

def generate_email(name):
    # Remove accents and spaces, make lowercase
    name_clean = ''.join(
        c for c in unicodedata.normalize('NFD', name)
        if unicodedata.category(c) != 'Mn'
    ).replace(' ', '.').lower()
    domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "uol.com.br"]
    return f"{name_clean}{random.randint(1,9999)}@{random.choice(domains)}"

# Generate the CSV file
with open('fake_data.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['id', 'nome', 'nomeSocial', 'rg', 'cpf', 'endereco', 'email', 'nascimento', 'genero', 'escolaridade', 'profissão'])  # Write header
    
    for i in range(1, 801):
        id = i
        name = generate_fake_name()
        socialName = generate_nome_social()
        gender = random.choice(genders)
        cpf = generate_cpf()
        rg = f"{random.randint(10000000, 99999999)}-{random.choice(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])}"
        address = generate_address()
        scholarship = random.choice(scholarships)
        # Randomly insert 'Outros' every 10-20 rows
        if i % random.randint(10, 20) == 0:
            profession = "Outros"
        else:
            profession = random.choice(professions)
        birthdate = generate_birthdate()
        email = generate_email(name)

        writer.writerow([id, name, socialName, rg, cpf, address, email, birthdate, gender, scholarship, profession])

print("CSV file 'fake_data.csv' generated successfully!")