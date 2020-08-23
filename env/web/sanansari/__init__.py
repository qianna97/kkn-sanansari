from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.secret_key = '@kKnSaN4nsR1'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db_sanansari.db'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/db_sanansari'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

from sanansari import routes