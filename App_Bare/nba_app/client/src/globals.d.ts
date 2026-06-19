// // help ts understand import structure
// declare module "*.module.css"; // App.module.css
// declare module "*.css"; // main.css 

// App.module.css
declare module '*.module.css' {
  const classes: { [key: string]: string };
  return classes;
}

// main.css 
declare module '*.css';
