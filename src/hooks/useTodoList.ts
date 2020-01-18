import React, {Dispatch, SetStateAction} from 'react';
import {fetchDocument, TripleDocument, TripleSubject} from 'tripledoc';
import {schema, solid} from 'rdf-namespaces';
import {usePublicTypeIndex} from './usePublicTypeIndex';
import {initialiseNotesList} from '../services/initialiseNotesList';

export function useTodoList(): [TripleDocument | undefined, Dispatch<SetStateAction<TripleDocument | undefined>>] {
    const publicTypeIndex = usePublicTypeIndex();
    const [notesList, setNotesList] = React.useState<TripleDocument>();

    React.useEffect(() => {
        if (!publicTypeIndex) {
            return;
        }

        (async () => {
            const notesListIndex = publicTypeIndex.findSubject(solid.forClass, schema.TextDigitalDocument);
            if (!notesListIndex) {
                // If no notes document is listed in the public type index, create one:
                const notesList = await initialiseNotesList()
                if (notesList === null) {
                    return;
                }
                setNotesList(notesList);
                return;
            } else {
                // If the public type index does list a notes document, fetch it:
                const notesListUrl = notesListIndex.getRef(solid.instance);
                if (typeof notesListUrl !== 'string') {
                    return;
                }
                const document = await fetchDocument(notesListUrl);
                setNotesList(document);
            }
        })();

    }, [publicTypeIndex]);

    return [notesList, setNotesList];
}

export function getNotes(notesList: TripleDocument): TripleSubject[] {
    return notesList.getSubjectsOfType(schema.TextDigitalDocument);
}
