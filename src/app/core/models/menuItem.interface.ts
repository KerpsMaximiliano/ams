export interface IMenuItem {
  children: IMenuChildren[];
  expanded: boolean;
  title: string;
}

export interface IMenuChildren {
  icon: string;
  title: string;
  url: string;
}
