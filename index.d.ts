export const isLoaded: boolean;

export function getBean<T>(name: string): T;

export function load(config: any): void;

export namespace beanFactory {
    function get<T>(name: string): T;

    function set(name: string, bean: any): void;

}

