import React from 'react';
import PropTypes from 'prop-types';
import styles from './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    const localData = localStorage.todos && JSON.parse(localStorage.todos);
    this.state = {
      data: localData
    };

    this.addTodo = this.addTodo.bind(this);
    this.removeTodo = this.removeTodo.bind(this);
  }

  updateLocalStorage() {
    if (typeof(Storage) !== "undefined")
    localStorage.todos = JSON.stringify(this.state.data);
  }

  addTodo(val) {
    let id;
    if (typeof(Storage) !== "undefined") {
      id = Number(localStorage.count);
      localStorage.count = Number(localStorage.count) + 1;
    } else {
      id = window.id++;
    }

    const todo = {
      value: val,
      id: id
    };

    this.state.data.push(todo);
    this.setState({
      data: this.state.data
    }, () => {
      this.updateLocalStorage();
    });
  }

  removeTodo(id) {
    const list = this.state.data.filter(todo => {
      if (todo.id !== id)
      return todo;
    });
    this.setState({
      data: list
    }, () => {
      this.updateLocalStorage();
    });
  }

  componentDidMount() {
    localStorage.clear();
    if (typeof(Storage) !== "undefined") {
      if(!localStorage.todos) {
        localStorage.todos = JSON.stringify(this.state.data);
      }
      if(!localStorage.count) {
        localStorage.count = 0;
      }
    } else {
      window.id = 0;
    }
  }

  render() {
    return (
      <div>
        <Title todoCount={this.state.data.length}/>
        <Form addTodo={this.addTodo} />
        <List todos={this.state.data} remove={this.removeTodo} />
      </div>
    );
  }
}

const Title = ({todoCount}) => {
  return (
    <div>
      <h2>To do ({todoCount}):</h2>
    </div>
  );
};

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleNewTodoAddition = this.handleNewTodoAddition.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  handleNewTodoAddition() {
    if(this.input.value !== '') {
      this.props.addTodo(this.input.value);
      this.setState({
        value: ''
      });
      this.input.placeholder = "Add todo here...";
    }
  }

  render() {
    return (
      <div>
        <input
          ref={node => {
            this.input = node;
          }}
          value={this.state.value}
          placeholder="Add todo here..."
          autoComplete="off"
          onChange={this.handleChange}
        />
        <button onClick={this.handleNewTodoAddition}>add todo</button>
      </div>
    );
  }
}

const Todo = ({todo, remove}) => {
  return (
    <p>
      {todo.value}
      &nbsp;
      <span onClick={()=> { remove(todo.id) }}>remove</span>
    </p>
  );
};

const List = ({todos, remove}) => {
  let allTodos = [];

  if(todos.length > 0) {
    allTodos = todos.map(todo => {
      return (<Todo todo={todo} remove={remove} key={todo.id} />);
    });
  } else {
    allTodos.push(<h3>All done !</h3>);
  }

  return (
    <div>
      <p> Your Todos: </p>
      {allTodos}
    </div>
  );
};

export default App
