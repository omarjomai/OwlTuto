(function () {
  const { Component,Store } = owl;
  const { xml } = owl.tags;
  const { whenReady } = owl.utils;
  const { useRef, useDispatch, useStore,useState } = owl.hooks;

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
    <t t-foreach="displayedTasks" t-as="task" t-key="task.id">
        <Task task="task"/>
    </t>
    </ul>
    <footer class="footer" t-if="tasks.length">
    <span class="todo-count">
      <strong>
          <t t-esc="remaining"/>
      </strong>
      <t t-esc="remainingText"/>
    </span>
    <ul class="filters">
      <li>
        <a t-on-click="() => this.setFilter('all')" t-att-class="{selected: this.filter === 'all'}">All</a>
      </li>
      <li>
        <a t-on-click="() => this.setFilter('active')" t-att-class="{selected: this.filter === 'active'}">Active</a>
      </li>
      <li>
        <a t-on-click="() => this.setFilter('completed')" t-att-class="{selected: this.filter === 'completed'}">Completed</a>
      </li>
    </ul>
    
  </footer>
    </section>`;

  class App extends Component {
    static template = APP_TEMPLATE;
    static components = { Task };
    inputRef = useRef("add-input");
    tasks = useStore((state) => state.tasks);
    dispatch = useDispatch();
    filter = useState({value: "all"})

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
    get displayedTasks() {
      switch (this.filter.value) {
          case "active": return this.tasks.filter(t => !t.isCompleted);
          case "completed": return this.tasks.filter(t => t.isCompleted);
          case "all": return this.tasks;
      }
    }
    setFilter(filter) {
      this.filter.value = filter;
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
