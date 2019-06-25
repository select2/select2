import { Component, ComponentChild, Fragment, h, RefObject, render } from 'preact';
import { getScrollParents, MouseEventListener, throttle } from './util';

class ContextProvider extends Component<{ context: any }> {
    public getChildContext() {
        return this.props.context;
    }
    public render() {
        return this.props.children;
    }
}

function Portal({ vnode, container }): null {
    // @ts-ignore
    const wrap = <ContextProvider context={this.context}>{vnode}</ContextProvider>;
    render(wrap, container);
    return null;
}

function createPortal(vnode, container): ComponentChild {
    return h(Portal, { vnode, container });
}

interface Props {
    controlRef: RefObject<HTMLElement>;
    dropdownRef: RefObject<HTMLElement>;
    class?: string;
    onClick?: MouseEventListener;
    onMouseDown?: MouseEventListener;
    onFocusOut?: EventListener;
}

export class Dropdown extends Component<Props> {
    private container?: HTMLElement;
    private scrollParents?: EventTarget[];
    private throttledPosition;

    constructor(props) {
        super(props);
        this.throttledPosition = throttle(50, this.position.bind(this));
    }

    public componentWillMount() {
        this.container = document.createElement('div');
        if (this.props.class) {
            this.container.className = this.props.class;
        }

        /*
        this container needs to be able to receive focus so we can tell
        it is not leaving the control - we consider dropdown part of the control
        */
        this.container.tabIndex = -1;
        if (this.props.onClick) {
            this.container.addEventListener('click', this.props.onClick);
        }
        if (this.props.onMouseDown) {
            this.container.addEventListener('mousedown', this.props.onMouseDown);
        }
        if (this.props.onFocusOut) {
            this.container.addEventListener('focusout', this.props.onFocusOut);
        }
        document.body.appendChild(this.container);
    }

    public componentDidMount() {
        this.props.dropdownRef.current = this.container;
        this.scrollParents = getScrollParents(this.props.controlRef.current!);
        this.scrollParents.forEach(parent => {
            ['resize', 'scroll', 'touchmove'].forEach(event => {
                parent.addEventListener(event, this.throttledPosition);
            });
        });
        this.position();
    }

    public componentWillUnmount() {
        if (this.scrollParents) {
            this.scrollParents.forEach(parent => {
                ['resize', 'scroll', 'touchmove'].forEach(event => {
                    parent.removeEventListener(event, this.throttledPosition);
                });
            });
            delete this.scrollParents;
            this.scrollParents = undefined;
        }

        this.props.dropdownRef.current = undefined;
        this.container!.parentElement!.removeChild(this.container!);
    }

    public componentDidUpdate() {
        this.position();
    }

    public render(props) {
        return createPortal(<Fragment>{this.props.children}</Fragment>, this.container!);
    }

    private position() {
        const control = this.props.controlRef.current!;
        const rect = control.getBoundingClientRect();
        const style = `top: ${rect.top + rect.height + window.pageYOffset}px;
            left: ${rect.left + window.pageXOffset}px;
            width: ${rect.width}px;`;
        this.container!.setAttribute('style', style);
    }
}
