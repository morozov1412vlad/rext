# Rext

## Motivation
React is great and flexible framework that allows to create large-scale applications really quick. However, from my experience working in different SaaS startups, there are often certain problems with React's flexibility. Due to aggresive deadlines, unstable code practices in organization and lack of time for code review, too late work on reducing tech debt and dependencies on legacy code, the codebase becomes poorly maintainable. Dependency hell, spaghetti code components and hooks slow down further development significantly.

For myself, I've decided to follow really simple rule to have better architecture in React applications: `Components must not know where data comes from and where it goes to`. In other words, components should receive handlers and states to operate with from respective hooks. They shouldn't care whether we use SWR, React Query, axios or anything else, they shouldn't know how data is cached or how it is stored in Redux. This simple quote helped me a lot to refactor and build architecture for highly maintainable React and NextJS apps.

## About Prototype
Taking inspiration from NestJS, I've build this prototype that introduces layered architecture for React apps. The main idea is to split UI from Data Management and introduce more comprehensive way of structuring Data Management layer itself.

Data Management layer consists of:
1. repositories that define methods for communicating with REST API using axios (analogue of TypeOrm Repository but for REST API).
2. services that use repositories for communicating with API and handling most of the logic for storing data in Redux, convering interfaces (in order to expose more unified UI-layered-friendly interfaces) and potentially a lot more (caching with RxDB, working with WebSockets or WebRTC, etc) (analogue of NestJS services).
3. slice services that are additional wrapper around redux slices that inroduce classes for managing Redux state.
4. converters that allow to define interfaces and defining rules for converting one interface into another.

React hooks should still be use for creating a bridge between Data Management and UI layers. Currently services provide static use method that provides all methods of the service as memoized methods to React.

## Further steps
1. InjectRepository, InjectService and InjectSliceService are just a syntax sugar for now. In future it would be great to implement more strict dependency injection as IoC mechanism and introduce concept of modules.
2. Converters are currently quite questionable. They probably will be reworked in the future.
3. More advanced logic for Redux store, that covers more of Redux functionality and introduces event emitter pattern for services to use.
4. Investigate and comeup with suitable architecture for apps that heavily rely on GraphQL.
5. Define rules for using and defining services in a way so they can be used on both server and browser sides in case of NextJS.

## Technology
Prototype heavily relies on TC39 ECMAScript Proposal decorators that are currently supported by TypeScript v5 as experimental feature. Depending on further updates of ECMA implementations might change, but hopefully usage can stay the same.

## TODOs:
- setup linter
- move to turborepo
