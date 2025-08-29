from flask import Flask, render_template

app = Flask(__init__)

@app.route=("/")
    def (home):
return render_template('home')

@app.route=("/about")
    def (about):
return render_template('about')

@app.route=("/register")
    def (register):
return render_template('register')

@app.route=("/login")
    def (login):
return render_template('login')

@app.route=("/logout")
    def (logout):
return render_template('logout')
