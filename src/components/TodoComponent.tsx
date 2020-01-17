import React from 'react';

interface Props {
    name: string;
    isComplete: boolean;
    onDelete: any;
    changeStatus: any;
};

export const TodoComponent: React.FC<Props> = (props) => {

    let className = '';
    if (props.isComplete) {
        className = 'completed';
    }

    return (
        <>
            <li className={className}>
                <div className="view">
                    <input className="toggle" type="checkbox" checked={props.isComplete} onChange={props.changeStatus}/>
                    <label>{props.name || ''}</label>
                    <button className="destroy" onClick={props.onDelete}></button>
                </div>
            </li>
        </>
    );
};

