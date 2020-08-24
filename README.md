# Saasville Public Library Books

Saasville Public Library Books is a simple web application built to view, search and reserve/unreserve books.

![Home page of the application](./extras/screenshot.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

The project is composed of two entities: **the frontend (React)** and **the backend (Django)**.

### Prerequisites

For the frontend, please make sure you have `yarn` or `npm` installed as one of your package manager.

For the backend, please make sure you have `pipenv` installed as one of your Python dependency managers.

You may find the installation instructions for `yarn` [here](https://classic.yarnpkg.com/en/docs/install), `npm` [here](https://www.npmjs.com/get-npm) and `pipenv` [here](https://pypi.org/project/pipenv/).


### Installing

1. Clone the current repository onto your local machine using either SSH or HTTPS
```
# HTTPS
git clone https://github.com/osubuu/react-django-app.git

# SSH
git clone git@github.com:osubuu/react-django-app.git
```

2. Once cloned, we will set up the backend first. Go into backend folder until you are on the same level as `Pipfile`. Run the following commands to set up your dependencies and start your Django server. Your server will be running on [http://localhost:8000](http://localhost:8000).
```
# set up dependencies
cd react-django-app/backend
pipenv install

# start Django server
cd server
python manage.py runserver
```


3. Once your server is running, we will now set up the frontend. Go into your frontend folder until make sure you are on the same level as `package.json`. Run the following commands to set up your dependencies and start your React server. Your server will be running on [http://localhost:3000](http://localhost:3000)

```
# assuming you are at the level of the Django server
cd ../../frontend

# install dependencies
yarn install
OR
npm install

# start React server
yarn start
OR
npm run start
```

4. Access the application on your web browser by going to [http://localhost:3000](http://localhost:3000)


## Built With

Frontend
* React
* Hooks

Backend
* Python3
* Django
