import React from 'react';
import {foaf} from 'rdf-namespaces';
import {useProfile} from '../hooks/useProfile';
import {TodosList} from './TodosList';

export const Dashboard: React.FC = () => {
    // const profile = useProfile();
    //
    // const name = (profile) ? profile.getString(foaf.name) : null;
    // const title = (name)
    //     ? `Public Todos for ${name}`
    //     : 'Public Todos';

    return <>
        <section className="todoapp">
            <TodosList />
        </section>
    </>;
};
