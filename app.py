from flask import Flask, request, render_template,url_for,flash,redirect,session
from flaskext.mysql import MySQL
from functools import wraps
from image_recomend import Images

# Recomendation
import pandas as pd
from sklearn.model_selection import train_test_split
import Recommender
import csv
import re


from twilio.rest import Client

app = Flask(__name__)

app.config['SECRET_KEY'] = 'ec830e5ae057c5b08f5a435a7b13e891'

# Config MySQL
app.config['MYSQL_DATABASE_HOST'] = "localhost"
#app.config['MYSQL_DATABASE_PORT'] = 3306
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'myflaskapp'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
# init MYSQL
mysql = MySQL()
mysql.init_app(app)

@app.route('/')
def main():

    try:

        if session['user_id']:

            user_ids = session['user_id']


            data = pd.read_csv('place_4.csv')
            data['all_place'] = data['place'].map(str) + " - " + data['type']


            song_grouped = data.groupby(['all_place']).agg({'rating': 'count'}).reset_index()
            grouped_sum = song_grouped['rating'].sum()
            song_grouped['percentage']  = song_grouped['rating'].div(grouped_sum)*100
            song_grouped.sort_values(['rating', 'all_place'], ascending = [0,1])


            train_data,test_data = train_test_split(data,test_size=0.2,random_state=0)
            pm = Recommender.popularity_recommender_py()
            pm.create(train_data, 'user_id', 'all_place')

                # user_id = 10
            content_based = pm.recommend(user_ids)
            place = []
            for index,row in content_based.iterrows():
                print(row['all_place'])
                place.append(row['all_place'])


            is_model = Recommender.item_similarity_recommender_py()
            is_model.create(train_data, 'user_id', 'all_place')

                # user_id = 10
            print(user_ids)
            user_ids = int(user_ids)
            user_items = is_model.get_user_items(user_ids)
            place_personal = []
            for user_item in user_items:
                print(user_item)
                place_personal.append(user_item)

            return render_template('index.html',content_based=place,personal_recomendation=place_personal)
    except:
        return render_template('login.html')
@app.route('/reg',methods=['GET','POST'])
def reg():
    return render_template('register.html')

@app.route('/register',methods=['GET','POST'])
def register():
    conn=mysql.connect()
    cursor = conn.cursor()
    if(cursor.execute("INSERT INTO users(user_name,user_id, password) VALUES(%s,%s,%s)",('2','1','1'))):
        print("data gone")
        conn.commit()
        cursor.close()

    return 'data inserted'


@app.route('/login',methods=['GET','POST'])
def login():

    try:
        if session['user_id']:
            return render_template('index.html')
    except:
        if request.method == 'POST':
            user_name = request.form['user_name']
            password = request.form['password']

            conn=mysql.connect()
            cursor = conn.cursor()
            result = cursor.execute("SELECT * FROM users WHERE user_name = %s", [user_name])
            print(result)
            if result > 0:
                data = cursor.fetchone()
                if password == data[3]:
                    session['logged_in'] = True
                    session['username'] = user_name
                    session['user_id'] = data[2]
                    flash('You are now logged in', 'success')
                    return redirect(url_for('main'))
            cursor.close()

        return render_template('login.html')    

# Check if user logged in
def is_logged_in(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            flash('Unauthorized, Please login', 'danger')
            return redirect(url_for('login'))
    return wrap


# Logout
@app.route('/logout')
@is_logged_in
def logout():
    session.clear()
    flash('You are now logged out', 'success')
    return redirect(url_for('login'))


@app.route('/search_city',methods=['GET','POST'])
def search_city():

    try:
        if session['user_id']:
            data = pd.read_csv('place_4.csv')
            city = data['city'].unique()

            return render_template('search_city.html',city=city)
    except:
        return render_template('login.html')

@app.route('/view_city/<city_name>',methods=['GET','POST'])
def view_city(city_name):

    try:
        if session['user_id']:
            if request.method == 'POST' or request.method == 'GET':
                data = pd.read_csv('place_4.csv')

                places = data[data['city'] == city_name]
                all_places = places.groupby(['place','type']).mean()
                dt = []
                for index,rows in all_places.iterrows():
                    new_data = {}
                    new_data['place']  = index[0]
                    new_data['rating'] = rows['rating']
                    new_data['type'] = index[1]
                    dt.append(new_data)
                print(dt)

                return render_template('view_city_place.html',data=dt,city_name=city_name)
    except:
        print('except in view city')
        return render_template('login.html')

@app.route('/rating/<city_name>/<place>/<types>',methods=['GET','POST'])
def rating(city_name,place,types):
    try:
        if session['user_id']:
            if request.method == 'POST':
                user_id = session['user_id']
                rating = request.form['rating']
                print(city_name,place,types,rating)
                with open('place_4.csv', 'a') as newFile:
                    newFileWriter = csv.writer(newFile)
                    newFileWriter.writerow([1,city_name,place,rating,types,user_id])

                # return render_template('rating.html')   
                flash('Rating Done!','success')
                return redirect(url_for('view_city',city_name=city_name))

    except:
        print('except in rating')
        return render_template('login.html')

@app.route('/search',methods=['POST','GET'])
def search():
    try:
        if session['user_id']:
            if request.method == 'POST':
                inputs = request.form['data']
                print(inputs)

                return render_template('search.html')
    except:
        return render_template('login.html')
                
@app.route('/index')
def index():
    return render_template('indexpage.html')
    
    
@app.route('/agra')
def agra():
    return render_template('tajmahal.html')
    
@app.route('/goa')
def goa():
    return render_template('goa.html')

@app.route('/mumbai')
def mumbai():
    return render_template('mumbai.html')
    
@app.route('/manali')
def manali():
    return render_template('manali.html')
    
@app.route('/delhi')
def delhi():
    return render_template('delhi.html')
@app.route('/jaipur')
def jaipur():
    return render_template('jaipur.html')



@app.route('/offers')
def offers():
    return render_template('offers.html')



@app.route('/index_msg')
def index_msg():
    return render_template('index.html')
    
    
    
@app.route('/image')
def image():
    return render_template('imagesearch.html')
@app.route('/upload',methods=['POST','GET'])
def upload():
    if request.method == 'POST':
        recomend = Images()
        data = recomend.Upload()
        
        location = data
        location  = re.findall('([^\/]+$)',location)
        new_loc  = "queries/"+location[0]
        print(new_loc)
        print("Working")

        res_loc = recomend.predict(new_loc)

        print(res_loc)
        res_name = res_loc[:-7]
        if res_name == 'Taj_Mahal':
            return 	render_template('main copy.html')
        elif res_name == 'qutub_minar':
            return 	render_template('main copy 2.html')
        elif res_name == 'Mysore_Palace':
            return 	render_template('mysore.html')
       
        elif res_name == 'Jantar_mantar':
            return 	render_template('jantar mantar.html') 
        elif res_name == 'hawa_mahal':
            return 	render_template('hawa mahal.html') 
            
        elif res_name == 'red_fort':
            return 	render_template('red fort.html') 
            
        elif res_name == 'gateway':
            return 	render_template('gateway of india.html')
            
        elif res_name == 'lotus_temple':
            return 	render_template('lotus temple.html')  
            
        elif res_name == 'Virupaksha':
            return 	render_template('virupaksha temple.html')         
        elif res_name == 'gol_gumbaz':
            return 	render_template('gol gumbaz.html')  
        elif res_name == 'golden_temple':
            return 	render_template('golden temple.html') 
        
        elif res_name == 'Jama_Masjid':
            return 	render_template('jama masjid.html') 
        else:
   	        return 	render_template('image.html')
    return render_template('indexpage.html')
    
    
@app.route('/send_message',methods=['POST','GET'])  
def send_message():
    if request.method == 'POST':
        name = request.form['name']
        msg = request.form['message']
        email_id = request.form['email']
        sub = request.form['subject']


        main_msg = "Name : "+name+"\nMobile Number : "+email_id+"\nSubject : "+sub+"\nMessage : "+msg

        print(main_msg)

        account_sid = 'ACd1d6016ea4d29b2bf41bbac3f00ae389' 
        auth_token = 'a8aba8be1b20cdca8809db1038be39d3' 
        client = Client(account_sid, auth_token) 
 
        message = client.messages.create( 
                              from_='whatsapp:+14155238886',  
                              body= main_msg,      
                              to='whatsapp:+918618049962'
                          ) 
 
        print(message.sid)
        # flash('Your message sended successfully', 'success')
        return redirect(url_for(''))




if __name__ == "__main__":
    app.run(debug=True)