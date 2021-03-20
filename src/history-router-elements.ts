import { createHistory, HistoryLocation } from "./history"

class HistoryLink extends HTMLAnchorElement {
    #root?: HistoryRouter
    connectedCallback() {
        this.#root = findRouterContextOrThrow(this)
        this.addEventListener("click", this.handleClick.bind(this))
    }
    handleClick(event: MouseEvent) {
        event.preventDefault()
        const path = this.getAttribute("href")
        if (!path || !this.#root) {
            return
        }
        this.#root.pushPath(path)
    }
}

class HistoryRoute extends HTMLElement {
    #root?: HistoryRouter
    #location?: HistoryLocation
    #path?: string
    #template?: HTMLTemplateElement
    #el?: ShadowRoot
    #unsubscribe?: Unsubscribe
    static get observedAttributes() {
        return ["path"]
    }
    attributeChangedCallback(attr: string, _oldValue: string, newValue: string) {
        if (attr === "path") {
            this.#path = newValue
            if (this.#location) {
                this.setLocation(this.#location)
            }
        }
    }
    connectedCallback() {
        this.#root = findRouterContextOrThrow(this)
        this.#template = this.querySelector("template") ?? undefined
        this.#el = this.attachShadow({ mode: "open" })
        this.appendChild(this.#el)
        this.#path = this.getAttribute("path") ?? undefined
        setTimeout(() => {
            this.#unsubscribe = this.subscribe(this.#root as HistoryRouter)
        })
    }
    disconnectedCallback() {
        this.#unsubscribe && this.#unsubscribe()
    }
    subscribe(root: HistoryRouter) {
        return root.subscribe((location) => this.setLocation(location))
    }
    setLocation(location: HistoryLocation) {
        if (!this.#template || !this.#el) {
            return
        }
        this.#location = location
        if (location.pathname === this.#path) {
            if (this.#el.childElementCount !== 0) {
                return
            }
            this.#el.appendChild(this.#template.content.cloneNode(true))
        } else {
            this.#el.innerHTML = ""
        }
    }
}

type Unsubscribe = Function
type LocationHandler = (loc: HistoryLocation) => void
class HistoryRouter extends HTMLElement {
    #subscribers: Set<LocationHandler>
    #history: ReturnType<typeof createHistory>
    #unsubscribe?: Function
    constructor() {
        super()
        this.#subscribers = new Set()
        this.#history = createHistory()
    }
    connectedCallback() {
        this.#unsubscribe = this.#history.listen((a) => this.updateLocation(a.location))
    }
    updateLocation(location: HistoryLocation) {
        this.#subscribers.forEach((sub) => sub(location))
    }
    disconnectedCallback() {
        this.#unsubscribe && this.#unsubscribe()
    }
    subscribe(f: LocationHandler): Unsubscribe {
        this.#subscribers.add(f)
        f(this.#history.location)
        return () => this.#subscribers.delete(f)
    }
    pushPath(path: string) {
        this.#history.push(path)
    }
}

window.customElements.define("history-route", HistoryRoute)
window.customElements.define("history-link", HistoryLink, { extends: "a" })
window.customElements.define("history-router", HistoryRouter)

function findRouterContextOrThrow(el: HTMLElement): HistoryRouter {
    const root = firstAncestor(el, (el: HTMLElement) => el.tagName.toLowerCase() === "history-router") as HistoryRouter | null
    if (!root) {
        throw new Error(`<${el.tagName.toLowerCase()}> requires a <history-router> parent (${el.outerHTML})`)
    }
    return root
}

type ElementFilterFn = (el: HTMLElement) => boolean
function firstAncestor(start: HTMLElement, f: ElementFilterFn): HTMLElement | null {
    let parent = start.parentElement
    while (parent) {
        if (f(parent)) {
            return parent
        }
        parent = parent.parentElement
    }
    return null
}
