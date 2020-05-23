import React, { Dispatch, Props } from "react";
import { Typography, Container, makeStyles, createStyles, Theme } from "@material-ui/core";
import InProgress from "../components/icons/InProgress";

const inProgressStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            flexDirection: "column",
            alignItems: "center"
        },
        icon: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            height: theme.spacing(10),
            width: theme.spacing(10)
        },
    }),
);


export default function InProgressView(props: Readonly<any>) {
    const classes = inProgressStyles();

    return (
        <Container className={classes.root} maxWidth="sm">
            <InProgress />
            <Typography paragraph>
                Work in progress
            </Typography>
            <AddTodoBound />
            <VisibleTodoList />
            <Footer />
        </Container>
    );
}

import { connect, Provider } from "react-redux";
import { Todo, TodoFilterCommandNames, FilterCommand, setVisibilityFilter, toggleTodo, addTodo, getVisibleTodos, TodoTextCommand, TodoIndexCommand } from "../redux/viewModels/todoViewModel";
import { State } from "../redux/store";

//console.log(store.getState());
// const unsubscribe = store.subscribe(() => console.log(store.getState()))

// Dispatch some actions
// store.dispatch(addTodo('Learn about actions'));
// store.dispatch(addTodo('Learn about reducers'));
// store.dispatch(addTodo('Learn about store'));
// store.dispatch(toggleTodo(0));
// store.dispatch(toggleTodo(1));
// store.dispatch(setVisibilityFilter(VisibilityFiltersOptions.SHOW_COMPLETED));

// unsubscribe();

function Todo(props: { onClick?: any, completed: boolean, text: string }) {
    return (
        <li
            style={{
                textDecoration: props.completed ? 'line-through' : 'none'
            }}
        >
            <a href=""
                onClick={e => {
                    e.preventDefault()
                    console.log(`clicking on the todo should trigger the onclick prop`);
                    props.onClick()
                }}>{props.text}</a>
        </li>);
};

function TodoList(props: { todos: Array<Todo>, onTodoClick: (id: number) => any }) {

    console.log(`content of the props`, props);

    return (
        props.todos.length > 0 ? <ul>
            {props.todos.map((todo, index) => (
                <Todo key={todo.id} {...todo} onClick={() => {
                    console.log(`Click on the children : ${todo.id}`);
                    props?.onTodoClick(todo.id)
                }} />
            ))}
        </ul> :
            "No todo"
    )
};

const st2 = (Vms: State) => {
    console.log(`mapping todos to the todo list props from the store`, Vms);
    return {
        todos: getVisibleTodos(Vms.todoStateEditor, Vms.todoFilterStateEditor)
    }
}

const ds2 = (dispatch: Dispatch<TodoIndexCommand>) => {
    return {
        onTodoClick: (id: number) => {
            dispatch(toggleTodo(id))
        }
    }
}

const VisibleTodoList = connect(st2, ds2)(TodoList as any);

function Link(props: { active: boolean, children: string, onClick: any }) {
    if (props.active) {
        return <span>{props.children}</span>
    }

    return (
        <a
            href=""
            onClick={e => {
                e.preventDefault()
                props.onClick()
            }}
        >
            {props.children}
        </a>
    )
};

const st1 = (state: State, ownProps: { filter: string }) => {
    return {
        active: ownProps.filter === state.todoFilterStateEditor
    }
}

const ds1 = (dispatch: Dispatch<FilterCommand>, ownProps: { filter: string }) => {
    return {
        onClick: () => {
            dispatch(setVisibilityFilter(ownProps.filter))
        }
    }
}

const FilterLink = connect(st1, ds1)(Link);

function Footer() {
    return (
        <p>
            Show: <FilterLink filter={TodoFilterCommandNames.SHOW_ALL}>All</FilterLink>
            {', '}
            <FilterLink filter={TodoFilterCommandNames.SHOW_ACTIVE}>Active</FilterLink>
            {', '}
            <FilterLink filter={TodoFilterCommandNames.SHOW_COMPLETED}>Completed</FilterLink>
        </p>
    )
};

let AddTodo = function (props: { dispatch: Dispatch<TodoTextCommand> }) {
    let input: any;

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    if (!input.value.trim()) {
                        return
                    }
                    props.dispatch(addTodo(input.value))
                    input.value = ''
                }}
            >
                <input
                    ref={node => {
                        input = node
                    }}
                />
                <button type="submit">Add Todo</button>
            </form>
        </div>
    )
}
const AddTodoBound = connect()(AddTodo as any);