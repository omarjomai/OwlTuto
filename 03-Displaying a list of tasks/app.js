(function () {
  const { Component } = owl;
  const { xml } = owl.tags;
  const { whenReady } = owl.utils;

  // Owl Components
  class App extends Component {
    static template = xml/* xml */ `
  <section t-name="TodoList" class="todoapp">
        <header class="header">
      <h1>todos</h1>
    </header>
    <ul class="todo-list">
    <t t-foreach="tasks" t-as="task" t-key="task.id">
            <li class="todo">
                <input class="toggle" type="checkbox" t-att-checked="task.isCompleted"/>
                <label><t t-esc="task.title"/></label>
            </li>
    </t>
    </ul>
    </section>`;

    tasks = [
      {
        id: 1,
        title: "task 1",
        isCompleted: true,
      },
      {
        id: 2,
        title: "task 2",
        isCompleted: false,
      },
    ];
  }

  // Setup code
  function setup() {
    const app = new App();
    app.mount(document.body);
  }

  whenReady(setup);
})();
