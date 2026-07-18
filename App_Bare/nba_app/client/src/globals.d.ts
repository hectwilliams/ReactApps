
declare module '*.module.css' {
    const classes: { 
        readonly [key: string]: string
    };
  export default classes;
}
declare module '*.module.scss' {
  const classes: { [key: string]: string };
//   export default classes;
    // return classes;
}

// named import 
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css';
