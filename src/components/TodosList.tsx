import React, {useState} from 'react';
import {TodoComponent} from './TodoComponent';
import {TripleSubject} from "tripledoc";
import {cal} from "rdf-namespaces";

interface Todo {
    key: number
    name: string;
    created: Date;
    complete: boolean;
    deleted?: Date;
};



export const TodosList: React.FC = () => {
    let todosArray: Todo[] = [
        {
            key: 0,
            name: "item 1",
            created: new Date(Date.now()),
            complete: false,
        },
        {
            key: 1,
            name: "item 2",
            created: new Date(Date.now()),
            complete: true
        },
        {
            key: 2,
            name: "item 3",
            created: new Date(Date.now()),
            complete: false
        }];
    //
    // const todoList = NOTES_INIT.reduce((previousValue: Todo, current: Todo) => {
    //     return {
    //         ...previousValue,
    //         [current.key]: current
    //     }
    // })


    const [todos, setTodos] = useState(todosArray);

    const [formContent, setFormContent] = React.useState('');
    //const [updatedNotesList, setUpdatedNotesList] = React.useState<Todo>();

    // if (!notesList) {
    //     return null;
    // }

    // const notes = getNotes(updatedNotesList || notesList);


    async function saveNote(event: React.FormEvent) {
        event.preventDefault();
        // if (!notesList) {
        //     return;
        // }
        // const updatedDoc = await addNote(formContent, updatedNotesList || notesList);
        // setUpdatedNotesList(updatedDoc);
        // setFormContent('');

        if (!formContent.trim().length) {
            return ;
        }

        const todo: Todo = {
            key: Date.now(),
            name: formContent,
            complete: false,
            created: new Date(Date.now())
        }

        todos.push(todo);

        setTodos(Object.assign([], todos));
        setFormContent('');
    }

    async function deleteNote(todo: Todo) {
        // const found = todos.find(t => t.key == todo.key);
        //
        // if (found) {
        //     found.complete = !found.complete;
        //     setTodos(Object.assign([], todos));
        // }
        // const notesDocument = updatedNotesList || notesList;
        // if (!notesDocument) {
        //     return;
        // }
        //
        // notesDocument.removeSubject(note.asRef());
        // const updatedDoc = await notesDocument.save();
        // setUpdatedNotesList(updatedDoc);
    }

    async function changeStatus(todo: Todo) {
        //console.log(todos);
        const found = todos.find(t => t.key == todo.key);

        if (found) {
            found.complete = !found.complete;
            setTodos(Object.assign([], todos));
        }

        // const notesDocument = updatedNotesList || notesList;
        // if (!notesDocument) {
        //     return;
        // }
        //
        // note.setLiteral(cal.status, newStatus);
        // note.setLiteral(schema.dateModified, new Date(Date.now()));
        // const updatedDoc = await notesDocument.save();
        // setUpdatedNotesList(updatedDoc);
        // return updatedDoc.getSubject(note.asRef());
    }

    const noteElements = todos.sort(byDate).sort(byComplete).map((todo: Todo) => (
        <TodoComponent key={todo.key} name={todo.name} isComplete={todo.complete} onDelete={() => {
            //deleteNote(todo)
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

