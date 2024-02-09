# Overview

Inside this directory you can find the files related to the project Web Client, the UI developed to consume the framework and present the experiment and its related tasks to the user (the participant in this case). The _public_ directory is created by the React Library when starting a new project and contains some files like _robots.txt_ and the _index.html_ file where the project is embedded.

The _src_ directory is where the files of interest are located. Inside this folder are the scripts to control the system's routes (_Routes.js_ and _Privateroutes.js_) and to render the app (index.js). The other directories have the following files:

**components**: in this directory are the scripts related to the system's interface (_App.js_), some elements of the search system (_SearchBar.js_, _SearchResult.js_ and _SearchResultPageView.js_), to the questionnaires (DemographicForm.js and LikertScaleForm.js - inside _forms_ folder) and to some auxiliar components like cards (TaskCard.js - inside _cards_ folder).

**config**: contains just the configuration of the axios library (_axios.js_) to communicate with the framework. The JSON format was setted. 

**contexts**: contains the _authGoogle.js_ context, where the logic of the authentication with Google, using the firebase's service, was implemented. 

**pages**: contains the pages where the information required along the experiment will be shown. In this directory you can find the code related to the page of the demographic survey (DemographicSurvey.js), to the page of the informed consent form (ICF.js), to the page of the instructions of the experiment or of some specific task (Instructions.js), to the page of the login (Login.js), to the questionnaires pages (PostQuestionnaire.js and PreQuestionnaire.js), to the tasks page (Tasks.js) and the page where the search task will be executed (TaskSearch.js).

**services**: contains just the _FirebaseConfig.js_ file, where the firebase's credentials of the project should be placed to use the authentication service. 
