import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import TodoEdit from "./components/TodoEdit";
import TodoInsert from "./components/TodoInsert";
import TodoList from "./components/TodoList";
import TodoTemplate from "./components/TodoTemplate";

function App() {
  const [todos, setTodos] = useState([]);
  const [insertToggle, setInsertToggle] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const onInsert = async (text) => {
    try {
      const data = await axios({
        url: "http://localhost:4000/todos",
        method: "POST",
      });
      setTodos(data.data);
    } catch (e) {
      setError(e);
    }
  };

  const onInsertToggle = () => {
    setInsertToggle((prev) => !prev);
  };

  const onRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/todos/${id}`);
      setTodos((todos) => todos.filter((todo) => todo.id !== id));
      console.log(setTodos);
    } catch (e) {
      setError(e);
    }
  };

  const onToggle = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/todos/check/${id}`);
      setTodos((todos) =>
        todos.map((todo) =>
          todo.id === id ? { ...todo, checked: !todo.checked } : todo
        )
      );
    } catch (e) {
      setError(e);
    }
  };

  const onUpdate = async (id, text) => {
    try {
      await axios({
        url: `http://localhost:4000/todos/${id}`,
        method: "PATCH",
        data: { text },
      });
      setTodos((todos) =>
        todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
      );
      onInsertToggle();
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await axios({
          url: "http://localhost:4000/todos",
          method: "GET",
        });
        console.log(data.data);
        setTodos(data.data);
        setIsLoading(false);
        // throw new Error("조회중 에러발생!!");
        // await new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     resolve()
        //   }, 3000)
        // })
      } catch (e) {
        setError(e);
      }
    };
    getData();
  }, []);

  if (error) {
    return <>에러: {error.message}</>;
  }

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <TodoTemplate>
      <TodoInsert onInsert={onInsert} />
      <TodoList
        todos={todos}
        onRemove={onRemove}
        onToggle={onToggle}
        onInsertToggle={onInsertToggle}
        setSelectedTodo={setSelectedTodo}
      />
      {insertToggle && (
        <TodoEdit
          onInsertToggle={onInsertToggle}
          selectedTodo={selectedTodo}
          onUpdate={onUpdate}
        />
      )}
    </TodoTemplate>
  );
}

export default App;
