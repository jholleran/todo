import React, {useState} from 'react';
import {TodoComponent} from './TodoComponent';
import {TripleSubject} from "tripledoc";
import {cal} from "rdf-namespaces";
import * as uuid from 'uuid';


interface Todo {
    key: string
    name: string;
    created: Date;
    complete: boolean;
    deleted?: Date;
};


export const TodosList: React.FC = () => {
    let NOTES_INIT: Todo[] = [
        {
            key: uuid.v4(),
            name: "item 1",
            created: new Date(Date.now()),
            complete: false,
        },
        {
            key: uuid.v4(),
            name: "item 2",
            created: new Date(Date.now()),
            complete: true
        },
        {
            key: uuid.v4(),
            name: "item 3",
            created: new Date(Date.now()),
            complete: false
        }];

    const [todos, setTodos] = useState(NOTES_INIT.reduce(
        (options, option) => ({
            ...options,
            [option.key]: option
        }),
        {}
    ));

    const [formContent, setFormContent] = React.useState('');

    async function saveNote(event: React.FormEvent) {
        event.preventDefault();

        if (!formContent.trim().length) {
            return;
        }

        const newId: string = uuid.v4();

        const todo: Todo = {
            key: newId,
            name: formContent,
            complete: false,
            created: new Date(Date.now())
        }


        setTodos({
            ...todos,
            [newId]: todo
        });

        setFormContent('');
    }

    async function deleteNote(todo: Todo) {
        // @ts-ignore
        delete todos[todo.key];

        setTodos({...todos});
    }

    async function changeStatus(todo: Todo) {
        todo.complete = !todo.complete;

        setTodos({
            ...todos,
            [todo.key]: todo
        });
    }


    const todoArray: Todo[] = Object.values(todos);
    console.log(todoArray);
    const noteElements = todoArray.sort(byDate).sort(byComplete).map((todo: Todo) => (
        <TodoComponent key={todo.key} name={todo.name} isComplete={todo.complete} onDelete={() => {
            deleteNote(todo)
        }} changeStatus={() => {
            changeStatus(todo);
        }}/>
    ));


    return (
        <>
            <header className="header">
                <h1>
                    Todos
                </h1>
                <form onSubmit={saveNote}>
                    <input className="new-todo" placeholder="What needs to be done?" value={formContent}
                           onChange={(e) => {
                               e.preventDefault();
                               setFormContent(e.target.value);
                           }}/>
                </form>
            </header>

            <section className="main">
                <ul className="todo-list">
                    {noteElements}
                </ul>
            </section>
            {/*<footer className="footer">*/}
            {/*    <span className="todo-count"><strong>{openTodosCount(notes)}</strong> items left</span>*/}
            {/*</footer>*/}
        </>
    );
};

function byDate(todoA: Todo, todoB: Todo): number {
    const dateA = todoA.created;
    const dateB = todoB.created;

    if (!(dateA instanceof Date) || !(dateB instanceof Date)) {
        return 0;
    }

    return dateB.getTime() - dateA.getTime();
}

function byComplete(note1: { complete: boolean }, note2: { complete: boolean }): number {
    if (note1.complete === note2.complete) {
        return 0;
    }

    if (note1.complete && !note2.complete) {
        return 1;
    }

    return -1;
}

function openTodosCount(todos: TripleSubject[]): number {
    return todos.filter((todo: TripleSubject) => {
        return cal.completed != todo.getString(cal.status);
    }).length;
}

