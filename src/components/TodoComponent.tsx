import React from 'react';
import {TripleSubject} from "tripledoc";
import {cal, schema} from "rdf-namespaces";

interface Props {
    todo: TripleSubject;
    onDelete: any;
    changeStatus: any;
};

export const TodoComponent: React.FC<Props> = (props) => {

    const isComplete = props.todo.getString(cal.status) === cal.completed;

    let className = '';
    if (isComplete) {
        className = 'completed';
    }

    return (
        <>
            <li className={className}>
                <div className="view">
                    <input className="toggle" type="checkbox" checked={isComplete} onChange={props.changeStatus}/>
                    <label>{props.todo.getString(schema.text) || ''}</label>
                    <button className="destroy" onClick={props.onDelete}></button>
                </div>
            </li>
        </>
    );
};

