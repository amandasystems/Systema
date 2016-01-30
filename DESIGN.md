## UI, DB etc
- DB is stored in the user's home directory (SQLite)
- On start-up, determine if migrations need to happen. If so, run them.
- DB is run on main thread, communication with IPC

## Sync and serialization
- Sync is done via serialization to JSON
- Strategy?!

## Concepts
- Everything is a note, but some notes are special (projects, events, tasks)
- All tasks/projets/notes are enumerated globally uniquely
- #NN is a reference (link) to task #NN
- Tags have 3 namespaces: system (inbox), list ("w32", "places to visit"), generic (all other tags)

### Views
- A view is a stored query
- A list is a stored query matching only a tag (in a special namespace)
- The inbox is a special stored query that is always available
