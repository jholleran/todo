import React from 'react';
import {cal, schema} from 'rdf-namespaces';
import {TripleSubject} from "tripledoc";

interface Props {
    value: TripleSubject;
    onDelete: Function;
    changeStatus: Function;
};

export const Todo: React.FC<Props> = (props) => {

    const status = props.value.getString(cal.status) || cal.created;

    if (status == cal.completed) {
        return (
            <>
                <li className="completed">
                    <div className="view">
                        <input className="toggle" type="checkbox" onClick={() => props.changeStatus(cal.created)}
                               checked/>
                        <label>{props.value.getString(schema.text) || ''}</label>
                        <button className="destroy" onClick={() => props.onDelete()}></button>
                    </div>
                </li>
            </>
        );
    }

    return (
        <>
            <li>
                <div className="view">
                    <input className="toggle" type="checkbox" onClick={() => props.changeStatus(cal.completed)}/>
                    <label>{props.value.getString(schema.text) || ''}</label>
                    <button className="destroy" onClick={() => props.onDelete()}></button>
                </div>
            </li>
        </>
    );
};

