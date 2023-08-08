// Type definitions for web


type User = {
	  id: string;
	  username: string;
	  sites: string[];
	  managedSites: string[];
	  apiKey: string;
};

type Site = {
	  id: string;
	  owner: string;
	  managers: string[];
	  b64_zwss: string;
};

type Block = {
	  type: string;
	  text?: string;
	  url?: string;
	  alt?: string;
};


type ZwssYaml = {
	type: string;
	title: string;
	id: string;
	body: {
		blocks: Block[];
	},
	personalStylesheet?: string;
};


type SiteArray = Site[];

declare module "express-session" {
	  interface SessionData {
		user: User;
	}
}




// Exports
export { User, Site, SiteArray, ZwssYaml, Block };

