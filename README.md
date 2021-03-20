# history-router-elements
minimal declarative custom element pushstate routing for browser apps


### usage

```html
<history-router>
    <nav>
        <ul>
            <li><a is="history-link" href="/">Home</a></li>
            <li><a is="history-link" href="/one">One</a></li>
            <li><a is="history-link" href="/two">Two</a></li>
        </ul>
    </nav>
    <history-route path="/">
        <template>
            <h1>Home</h1>
        </template>
    </history-route>
    <history-route path="/one">
        <template>
            <h1>One</h1>
        </template>
    </history-route>
    <history-route path="/two">
        <template>
            <h1>Two</h1>
        </template>
    </history-route>
</history-router>
```
