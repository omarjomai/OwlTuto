(function () {
  const { Component,Store } = owl;
  const { xml } = owl.tags;
  const { whenReady } = owl.utils;
  const { useRef, useDispatch, useStore } = owl.hooks;

  // -------------------------------------------------------------------------
  // Store
  // -------------------------------------------------------------------------
  const actions = {
    addTask({ state }, title) {
      title = title.trim();
      if (title) {
        const task = {
          id: state.nextId++,
          title: title,
          isCompleted: false,
        };
        state.tasks.push(task);
      }
    },
    toggleTask({ state }, id) {
      const task = state.tasks.find((t) => t.id === id);
      task.isCompleted = !task.isCompleted;
    },
    deleteTask({ state }, id) {
      const index = state.tasks.findIndex((t) => t.id === id);
      state.tasks.splice(index, 1);
    },
  };
  const initialState = {
    nextId: 1,
    tasks: [],
  };
  // -------------------------------------------------------------------------
  // Task Component
  // -------------------------------------------------------------------------
  const TASK_TEMPLATE = xml/* xml */ `
    <li class="todo" t-att-class="props.task.isCompleted ? 'completed' : ''">
        <input class="toggle" type="checkbox" t-att-checked="props.task.isCompleted" t-on-click="dispatch('toggleTask', props.task.id)" />
        <label><t t-esc="props.task.title"/></label>
        <button class="destroy" t-on-click="dispatch('deleteTask', props.task.id)"></button>
    </li>`;

  class Task extends Component {
    static template = TASK_TEMPLATE;
    static props = ["task"];
    dispatch = useDispatch();
  }
  // -------------------------------------------------------------------------
  // App Component
  // -------------------------------------------------------------------------
  const APP_TEMPLATE = xml/* xml */ `
    <section t-name="TodoList" class="todoapp">
    <header class="header">
    <h1>todos</h1>
    <input class="new-todo"  autocomplete="off" placeholder="What needs to be done?" t-ref="add-input" t-on-keyup="addTask"/>
    </header>
    <ul class="todo-list" >
    <t t-foreach="tasks" t-as="task" t-key="task.id">
        <Task task="task"/>
    </t>
    </ul>
    </section>`;

  class App extends Component {
    static template = APP_TEMPLATE;
    static components = { Task };
    inputRef = useRef("add-input");
    tasks = useStore((state) => state.tasks);
    dispatch = useDispatch();
    mounted() {
      this.inputRef.el.focus();
    }
    addTask(ev) {
      // 13 is keycode for ENTER
      if (ev.keyCode === 13) {
        this.dispatch("addTask", ev.target.value);
        ev.target.value = "";
      }
    }
  }

  // Setup code

  function makeStore() {
    const localState = window.localStorage.getItem("todoapp");
    if(!localState)
    localStorage.setItem("todoapp", JSON.stringify(initialState));
    const state = localState ? JSON.parse(localState) : initialState;
    const store = new Store({ state, actions });
    store.on("update", null, () => {
      localStorage.setItem("todoapp", JSON.stringify(store.state));
    });
    return store;
  }
  

  function setup() {
    owl.config.mode = "dev";
    App.env.store = makeStore();
    const app = new App();
    app.mount(document.body);
  }

  whenReady(setup);
})();
