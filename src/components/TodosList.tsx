import React from 'react';
import {TodoComponent} from './TodoComponent';
import {TripleDocument, TripleSubject} from "tripledoc";
import {cal, rdf, schema} from "rdf-namespaces";
import {getNotes, useTodoList} from "../hooks/useTodoList";


export const TodosList: React.FC = () => {

    const [formContent, setFormContent] = React.useState('');
    const [todoDocument, setTodoDocument] = useTodoList();

    if (!todoDocument) {
        return null;
    }

    const todoListArray = getNotes(todoDocument);

    async function saveNote(event: React.FormEvent) {
        event.preventDefault();

        if (!formContent.trim().length) {
            return;
        }

        if (todoDocument) {
            const newNote = todoDocument.addSubject();
            newNote.addRef(rdf.type, schema.TextDigitalDocument);
            newNote.addLiteral(schema.text, formContent);
            newNote.addLiteral(schema.dateCreated, new Date(Date.now()))

            const updatedDoc = await todoDocument.save([newNote]);
            setTodoDocument(updatedDoc);

            setFormContent('');
        }
    }

    async function deleteNote(todo: TripleSubject) {
        if (todoDocument) {
            todoDocument.removeSubject(todo.asRef());
            const updatedDoc = await todoDocument.save();
            setTodoDocument(updatedDoc);
        }
    }

    async function changeStatus(todo: TripleSubject) {
        if (isComplete(todo)) {
            todo.setLiteral(cal.status, cal.created);
        } else {
            todo.setLiteral(cal.status, cal.completed);
        }

        if (todoDocument) {
            const updatedDoc = await todoDocument.save();
            setTodoDocument(updatedDoc);
        }
    }

    const noteElements = todoListArray.sort(byDate).map((todo: TripleSubject) => (
        <TodoComponent key={todo.asRef()} todo={todo} onDelete={() => {
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
            <footer className="footer">
                <span className="todo-count"><strong>{openTodosCount(todoListArray)}</strong> items left</span>
            </footer>
        </>
    );
};

function byDate(note1: TripleSubject, note2: TripleSubject): number {
    const date1 = note1.getDateTime(schema.dateCreated);
    const date2 = note2.getDateTime(schema.dateCreated);
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
        return 0;
    }

    return date2.getTime() - date1.getTime();
}

function byComplete(note1: TripleSubject, note2: TripleSubject): number {
    if (isComplete(note1) === isComplete(note2)) {
        return 0;
    }

    if (isComplete(note1) && !isComplete(note2)) {
        return 1;
    }

    return -1;
}

function isComplete(todo: TripleSubject) {
    return cal.completed === todo.getString(cal.status);
}

function openTodosCount(todos: TripleSubject[]): number {
    return todos.filter((todo: TripleSubject) => {
        return !isComplete(todo);
    }).length;
}

