import React from 'react';
import {getNotes, useNotesList} from '../hooks/useNotesList';
import {Todo} from './Todo';
import {TripleDocument, TripleSubject} from "tripledoc";
import {cal, schema} from "rdf-namespaces";
import {addNote} from "../services/addNote";

export const TodosList: React.FC = () => {
    const notesList = useNotesList();
    const [formContent, setFormContent] = React.useState('');
    const [updatedNotesList, setUpdatedNotesList] = React.useState<TripleDocument>();

    if (!notesList) {
        return null;
    }

    const notes = getNotes(updatedNotesList || notesList);


    async function saveNote(event: React.FormEvent) {
        event.preventDefault();
        if (!notesList) {
            return;
        }
        const updatedDoc = await addNote(formContent, updatedNotesList || notesList);
        setUpdatedNotesList(updatedDoc);
        setFormContent('');
    }

    async function deleteNote(note: TripleSubject) {
        const notesDocument = updatedNotesList || notesList;
        if (!notesDocument) {
            return;
        }

        notesDocument.removeSubject(note.asRef());
        const updatedDoc = await notesDocument.save();
        setUpdatedNotesList(updatedDoc);
    }

    async function changeStatus(note: TripleSubject, newStatus: string) {
        const notesDocument = updatedNotesList || notesList;
        if (!notesDocument) {
            return;
        }

        note.setLiteral(cal.status, newStatus);
        note.setLiteral(schema.dateModified, new Date(Date.now()));
        const updatedDoc = await notesDocument.save();
        setUpdatedNotesList(updatedDoc);
        return updatedDoc.getSubject(note.asRef());
    }

    const noteElements = notes.sort(byDate).map((note) => (
        <Todo value={note} onDelete={() => {
            deleteNote(note)
        }} changeStatus={(status: string) => {
            changeStatus(note, status)
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
                <span className="todo-count"><strong>{openTodosCount(notes)}</strong> items left</span>
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

function openTodosCount(todos: TripleSubject[]): number {
    return todos.filter((todo: TripleSubject) => {
        return cal.completed != todo.getString(cal.status);
    }).length;
}

