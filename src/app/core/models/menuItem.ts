export interface MenuItem {
    children: MenuChildren[];
    expanded: boolean;
    title: string;
  }
  
  export interface MenuChildren {
    icon: string;
    title: string;
    url: string;
  }