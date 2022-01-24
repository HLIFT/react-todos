import './todo.css'
import { useState } from "react";
import { Todo } from "./Todo";
import { Filter } from "./Filter";

export const App = () => {

    const getFreshTodo = () => ({
        id: null,
        title: "",
        description: "",
        labelId: 0,
        dueDate: "",
        completed: false
    })

    const getLabel = (id) => {
        return labels.filter(item => item.id === id)
    }

    const [todos, setTodos] = useState({})
    const [newTodo, setNewTodo] = useState(getFreshTodo)
    const [countIdTodos, setCountIdTodos] = useState(1)
    const labels = [
        { id: 0, title: "non classé", name: 'nc' },
        { id: 1, title: "dev front", name: 'df' },
        { id: 2, title: "dev back", name: 'db' }
    ]
    const [filter, setFilter] = useState('all')

    const remaining = Object.values(todos).filter(item => !item.completed).length

    const [inEdition, setInEdition] = useState(false)
    const [search, setSearch] = useState('')

    const handleOnChangeInputs = (event) => {
        setNewTodo({ ...newTodo, [event.target.name]: event.target.value })
    }

    const handleOnEdit = todo => {
        setInEdition(true)
        setNewTodo(todo)
    }

    const exitEdition = () => {
        setInEdition(false)
        setNewTodo(getFreshTodo)
    }

    const handleOnSubmit = (event) => {
        event.preventDefault()
        if (newTodo.id !== null) {
            setTodos(currentTodos => {
                return { ...currentTodos, [newTodo.id]: { ...newTodo } }
            })
        } else {
            setTodos({
                ...todos, [countIdTodos]: {
                    "id": countIdTodos,
                    "title": newTodo.title,
                    "description": newTodo.description,
                    "labelId": newTodo.labelId,
                    "dueDate": newTodo.dueDate,
                    "completed": false
                }
            })
            setCountIdTodos(oldCount => oldCount + 1)
        }
        setNewTodo(getFreshTodo)
        setInEdition(false)
    }

    const handleClickOnCompleted = todo => {

        setTodos(currentTodos => {
            return { ...currentTodos, [todo.id]: { ...todo, completed: !todo.completed } }
        })
    }

    const handleClickOnDelete = deleteTodo => {
        setTodos(currentTodos => {
            delete currentTodos[deleteTodo.id]
            return { ...currentTodos }
        })
    }

    const handleClickOnDeleteDone = () => {
        setTodos(currentTodos => {
            return Object.fromEntries(Object.entries(currentTodos).filter(([id, todo]) => {
                return !todo.completed
            }))
        })
    }

    const handleClickOnFilter = (event) => {
        event.preventDefault()
        setFilter(event.target.name)
    }

    const markAllAsRead = () => {
        if (Object.entries(todos).filter(([id, todo]) => !todo.completed).length > 0) {
            setTodos(currentTodos => {
                return Object.fromEntries(Object.entries(currentTodos).map(todo => {
                    todo[1].completed = true
                    return todo
                }))
            })
        } else {
            setTodos(currentTodos => {
                return Object.fromEntries(Object.entries(currentTodos).map(todo => {
                    todo[1].completed = false
                    return todo
                }))
            })
        }

    }

    return (
        <div className="todoapp">
            <header className="header">
                <h1>Todos</h1>
                <form onSubmit={handleOnSubmit}>
                    <input name="title" type="text" className="new-todo" placeholder="Ajouter une tâche"
                           value={newTodo.title} onChange={handleOnChangeInputs}/>
                    <input name="description" type="textarea" className="new-todo" placeholder="Description"
                           value={newTodo.description} onChange={handleOnChangeInputs}/>
                    <select name="labelId" id="select-label" className="new-todo" onChange={handleOnChangeInputs}
                            value={newTodo.labelId}>
                        <option value={0} disabled={true}>Définir un label</option>
                        {labels.map(label => {
                            return <option key={label.id} value={label.id}>{label.title}</option>
                        })}
                    </select>
                    <input name="dueDate" type="date" className="new-todo" value={newTodo.dueDate}
                           onChange={handleOnChangeInputs}/>
                    <button type="submit"/>
                </form>
                {inEdition === true ?
                    <button className="edit" onClick={exitEdition}>Annuler la modification</button> : ''}

            </header>
            <div className="main">
                <input id="toggle-all" type="checkbox" className="toggle-all"/>
                <label onClick={markAllAsRead}>Mark all as complete</label>
                <ul className="todo-list">
                    {
                        filter !== 'date' ?
                            Object.values(todos).filter(item => {
                                switch (filter) {
                                    case 'todo' :
                                        return !item.completed
                                    case 'done' :
                                        return item.completed
                                    case 'all' :
                                        return item
                                    case 'search':
                                        return item.title.includes(search) || item.description.includes(search)
                                    default :
                                        const label = labels.find(label => label.name === filter)
                                        if (label !== undefined) {
                                            return item.labelId.toString() === label.id.toString()
                                        } else {
                                            return item
                                        }
                                }
                            }).map(todo => {
                                return <Todo key={todo.id} todo={todo} handleClickOnCompleted={handleClickOnCompleted}
                                             handleClickOnDelete={handleClickOnDelete} getLabel={getLabel}
                                             handleClickOnEdit={handleOnEdit}/>
                            }) : Object.values(todos).filter(item => {
                                return item.dueDate !== ''
                            }).sort((a, b) => {
                                return new Date(a.dueDate) - new Date(b.dueDate)
                            }).map(todo => {
                                return <Todo key={todo.id} todo={todo} handleClickOnCompleted={handleClickOnCompleted}
                                             handleClickOnDelete={handleClickOnDelete} getLabel={getLabel}
                                             handleClickOnEdit={handleOnEdit}/>
                            })
                    }
                </ul>
            </div>
            <footer className="footer">
                <span className="todo-count"><strong>{remaining}</strong> tâches à faire</span>
                <ul className="filters">
                    <Filter name={"all"} filter={filter} handleClickOnFilter={handleClickOnFilter} text={"Toutes"}/>
                    <Filter name={"todo"} filter={filter} handleClickOnFilter={handleClickOnFilter} text={"À faire"}/>
                    <Filter name={"done"} filter={filter} handleClickOnFilter={handleClickOnFilter} text={"Faites"}/>
                </ul>
                <button className="clear-completed" onClick={handleClickOnDeleteDone}> Supprimer tâches terminées
                </button>
                <br/>
                <ul className={'filters'} style={{ marginTop: 8 }}>
                    <Filter name={"date"} filter={filter} handleClickOnFilter={handleClickOnFilter}
                            text={"Date croissante"}/>
                    {
                        labels.map(el => {
                            return <Filter key={el.id} name={el.name} filter={filter}
                                           handleClickOnFilter={handleClickOnFilter}
                                           text={el.title}/>
                        })
                    }
                </ul>
                <br/>
                <form onSubmit={event => event.preventDefault()}>
                    <input className="new-todo" name={'search'} type={'text'} placeholder={'Rechercher'} value={search}
                           onChange={event => {
                               setSearch(event.target.value)
                               setFilter('search')
                           }} style={{ marginTop: 17 }}/>
                </form>
            </footer>
        </div>
    )
}
