class User:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

class JobOffer:
    def __init__(self, title, description, company, location, price, created_by):
        self.title = title
        self.description = description
        self.company = company
        self.location = location
        self.price = price
        self.created_by = created_by