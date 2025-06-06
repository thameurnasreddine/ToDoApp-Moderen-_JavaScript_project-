

const API_URL='https://jsonplaceholder.typicode.com/todos'
let todoState =[] ;
const STORAGE_KEY = 'todos-app';
let currentFilter = 'all';

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoState));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}


async function fetchTodos(){
    showLoading();
    try{

        let todos = loadFromLocalStorage();

        if (todos.length === 0) {
            
        

        const response= await fetch(API_URL)
        if(!response.ok){
            throw new Error(`HTTP error! status:,${response.status}`)

        }
        todos = await response.json()
        todos = todos.slice(0,10)
        saveToLocalStorage()


    }
        
        todoState = todos
        return todoState;
        

    }
    catch(error){
        console.error('Failed to fetch todos :', error)
    return [] ;


    }finally{
        hideLoading();
        updateTodoCount();

    }
}

function filterTodos(filter =currentFilter) {
    currentFilter =filter
 
    document.querySelectorAll('.filter-btn').forEach(
        btn => {
            btn.classList.toggle('active',btn.dataset.filter===filter)
        }
    )
    const filterTodos =todoState.filter(
        todo => {
            if(filter === 'active') return !todo.completed;
            if(filter === 'completed') return todo.completed;

            return true ;
        }
    )
renderTodoList(filterTodos)

}

function createTodoElement(todo){
    const todoElement = document.createElement('div')
    todoElement.className =`todo-item ${todo.completed ? 'completed' : ''}`
    todoElement.id = `todo-${todo.id}`
    todoElement.innerHTML =`
    <span class="todo-text">${todo.title}</span>
    
    <div class ="todo-actions">
    <button class="btn btn-toggle" data-action="toggle">
    ${todo.completed ? 'Undo' : 'Complete'}
    </button>
    <button class="btn btn-delete" data-action="delete" >
    Delete
    </button>

    </div>
    `
    return todoElement ;
}
function upddateTodoElement (todo){
    const todoElement= document.getElementById(`todo-${todo.id}`)
    if (todoElement) {
        const newTodoElement =createTodoElement(todo)
        todoElement.replaceWith(newTodoElement);
    }

}

function renderTodoList(todos =todoState) {
    const todoList= document.getElementById('todoList');
    todoList.innerHTML='';
    if(todos.length === 0)
    {
        todoList.innerHTML = `
        <p> No todos found. </p>`
        return;
    }
    todos.forEach(
        todo => {
            const todoElement = createTodoElement(todo)
            todoList.appendChild(todoElement)
        }
    )
}
function updateTodoCount() {
    const activeCount = todoState.filter(
        todo => !todo.completed
    ).length
    document.getElementById('todoCount').textContent =
    `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;

}

function handelTodoAction(event){
    // const button= event.target.closest('button');
    const button = event.target.closest('button');
    if (!button) return ;
    const action =button.dataset.action;

    const todoElement =button.closest('.todo-item')

    const todoId =parseInt(todoElement.id.replace('todo-',''))

    const todo = todoState.find( t=> t.id === todoId)
    if(!todo) return;
    if (action === 'toggle') {
        toggleTodoStatus(todo)
    } else if (action === 'delete') {
        deleteTodo(todo)
    }
}

async function toggleTodoStatus(todo){

    const todoElement = document.getElementById(`todo-${todo.id}`);
    const toggleButton = todoElement.querySelector('.btn-toggle');
    toggleButton.disabled = true;

    try { 

        const response = await fetch(`${API_URL}/${todo.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                completed: !todo.completed // Toggle the status
            })
        })
        if(!response.ok) throw new Error('Failed to update todo')
        
        todo.completed = !todo.completed ;
        upddateTodoElement(todo);



    } catch (error) {
        console.error('Error updating todo :',error)
        alert(' Failed to update todo . Please try again. ')
        toggleButton.disabled = false;
    }

    saveToLocalStorage();
    updateTodoCount();
    filterTodos();
}
function clearCompleted() {
    const completedTodos = todoState.filter(todo => todo.completed);
    completedTodos.forEach(async todo => {
        await deleteTodo(todo);
    });
}

async function deleteTodo(todo) {

    const todoElement = document.getElementById(`todo-${todo.id}`);
    todoElement.classList.add('deleting');

    try {
        
        const response = await fetch(`${API_URL}/${todo.id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete todo');

        todoState = todoState.filter(t => t.id !== todo.id)

        const todoElement = document.getElementById(`todo-${todo.id}`)

        todoElement.style.opacity = '0';
        setTimeout(() => {
            todoElement.remove();
            if (todoState.length === 0) {
                document.getElementById('todoList').innerHTML =
                    '<p>No todos found.</p>';
            }
        }, 300);

    } catch (error) {
        
        console.error('Error deleting todo:', error);
        alert('Failed to delete todo. Please try again.');

        todoElement.classList.remove('deleting');



    }

    saveToLocalStorage();
    updateTodoCount();
}

function initializeForm() {
    
    const form = document.getElementById('todoForm')
    const input = document.getElementById('todoInput')
    
    form.addEventListener('submit',async(event) =>
    {
        event.preventDefault();
        const todoText = input.value.trim();

        if (todoText.length < 3) {
            alert('Todo must be at least 3 characters long');
            return;
        }
        await createTodo(todoText);
        input.value ='';

    } )
}



async function createTodo(todoText) {
    
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    try {
        const newTodo = {
            title: todoText,
            completed: false,
            userId: 1  // Required by JSONPlaceholder
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo)
        });

        if (!response.ok) {
            throw new Error('Failed to create todo');
        }

        const createdTodo = await response.json();

        const simulatedTodo = {
            ...createdTodo,
            id: Date.now(), // Generate a unique ID
        };

        todoState.unshift(simulatedTodo);

        const todoElement = createTodoElement(simulatedTodo)
        const todoList = document.getElementById('todoList')
        
        todoElement.style.opacity='0'

        todoList.insertBefore(todoElement, todoList.firstChild);

        requestAnimationFrame(
            ()=>{
                todoElement.style.opacity='1';
            }
        )



    } catch (error) {
       
        console.error('Error creating todo:', error);
        alert('Failed to create todo. Please try again.');

    }finally{
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }
    saveToLocalStorage();
    updateTodoCount();
    filterTodos(); 
}


function showLoading() {
    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingMessage').style.display = 'none';
}
function showError(message) {
    const errorElement = document.getElementById('errorMessage')
    errorElement.textContent= message 
    errorElement.style.display='block'
    setTimeout(()=>{
        errorElement.style.display ='none'

    },3000)
}

async function intializeApp(){

    initializeForm();

    // Initialize filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => filterTodos(btn.dataset.filter));
    });

    // Initialize clear completed
    document.getElementById('clearCompleted').addEventListener('click', clearCompleted);

    // Initialize todo list
    document.getElementById('todoList').addEventListener('click',handelTodoAction);

    // Load initial todos
    fetchTodos().then(() => {
        filterTodos('all');
        updateTodoCount();
    });

}

window.onload = intializeApp;

