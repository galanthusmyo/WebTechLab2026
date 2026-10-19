# Lesson 2 — Interactive Task List

**Estimated time:** 45–60 minutes  
**Goal:** Understand the model → render → user interaction cycle and safely handle DOM events.

## 1. The data flow
1. **Model:** `tasks` is an array of task objects.
2. **Render:** `renderTasks()` turns the array into DOM elements.
3. **Interaction:** a form submission or click updates the model.
4. **Render again:** the UI is rebuilt from the updated model.

Keeping the model as the source of truth makes behavior easier to reason about.

## 2. Safe DOM creation
The example uses `document.createElement()` and `textContent`. Do not use `innerHTML` to insert user-provided task text. For example, the text `<img src=x onerror=alert(1)>` should be displayed literally rather than parsed as markup.

## 3. Event delegation
Instead of attaching a click listener to every task button, attach one listener to the parent `<ul>`. Click events bubble up from a button to the list. This is called **event delegation** and it also works for buttons created later.

## 4. `event.target` versus `event.currentTarget`
- `event.target` is the element where the event originated (or the deepest originating element, such as a nested icon).
- `event.currentTarget` is the element whose listener is currently running.

In `handleListClick`, `event.target` is used to find the button that was clicked. If you log `event.currentTarget`, it will be the `<ul>` because that is where the listener is attached.

Try:
```js
console.log("target:", event.target);
console.log("currentTarget:", event.currentTarget);
```

## 5. Cleanup
`removeEventListener()` removes a listener when it is no longer needed. The function must receive the same function reference used with `addEventListener()`. The example exposes `window.taskListCleanup()` for experimentation; call it from DevTools and then try clicking the list.

## Completion checklist
- [ ] I can explain model → render → interaction.
- [ ] I can create DOM nodes safely.
- [ ] I can explain event bubbling and delegation.
- [ ] I can distinguish `target` from `currentTarget`.
- [ ] I can remove an event listener.
