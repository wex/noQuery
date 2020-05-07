const isHtml = t => (t.indexOf('<') >= 0);

const toElement = (v) => {
    const template = document.createElement('template');
    template.innerHTML = v;

    return template.content.cloneNode(true).childNodes[0];
};

const noQuery = (selector) => {
    return new noQueryCore( selector );
};

window.$ = window.noQuery = noQuery;

class noQueryCore
{
    constructor(selector)
    {
        if (selector instanceof noQueryCore) {
            this.elements = selector.elements;
        } else if (selector instanceof Array) {
            this.elements = selector;
        } else if (selector instanceof NodeList) {
            this.elements = Array.from( selector );
        } else if (selector instanceof HTMLElement) {
            this.elements = [ selector ];
        } else if (isHtml(selector)) {
            this.elements = [ toElement(selector) ];
        } else {
            this.elements = Array.from( document.querySelectorAll( selector ) );
        }
    }

    each(callback)
    {
        let t;
        for (let i = 0; i < this.elements.length; i++) {
            t = noQuery( this.elements[i] );
            callback.call( t, i, t );
        }

        return this;
    }

    addClass(...classNames)
    {
        this.elements.map(t => {
            t.classList.add(...classNames);
        });

        return this;
    }

    removeClass(...classNames)
    {
        this.elements.map(t => {
            t.classList.remove(...classNames);
        });

        return this;
    }

    hasClass(className)
    {
        return new noQueryCore(
            this.elements.filter(e => {
                return e.classList.contains(className);
            })
        );
    }

    text(value = undefined)
    {
        if (value === undefined) {

            return this.elements.map(t => {
                return t.innerText;
            }).join('');

        } else {

            this.elements.map(t => {
                t.innerText = value;
            });

            return this;

        }
    }

    html(value = undefined)
    {
        if (value === undefined) {

            return this.elements.map(t => {
                return t.innerHTML;
            }).join('');

        } else {

            this.elements.map(t => {
                t.innerHTML = '';
                t.appendChild( toElement(value) );
            });

            return this;

        }
    }
}

export default noQuery;