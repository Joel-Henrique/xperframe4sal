# A Framework to support empirical experimentation on Cognitive Biases in Search as Learning

This repository contains the source code for the Xper4SAL. The Xper4SAL is the framework capable of instantiating experimentation on Cognitive Biases in Search as Learning.

The `/server` folder contains the source code of the backend developed in NestJS. The `/web` folder contains the frontend developed in ReactJS.

## Dependences

We recommend the version **_v18.9.0_** of **_node_** and the **_pnpm_** packager manager to execute the code. Before running the commands to start the API or the interface, run the command **_pnpm install_** inside the directories **_server_** and **_web_** to install the necessary dependences.

## To run the API

Use the command: **_pnpm start_** inside the **_server_** directory.

## To run the UI
Use the command **_pnpm run build_** to build the web site, then use the command **_pnpm start_** to start the app. both commands should be executed inside the **_web_** directory.


## Citation
Marcelo Machado, Elias C. Assis, Jairo F, Souza, and Sean W. M. Siqueira. 2024. [A framework to support experimentation in the context of Cognitive Biases in Search as a Learning process](https://doi.org/10.1145/3658271.3658310). In Proceedings of the 20th Brazilian Symposium on Information Systems (SBSI '24). Association for Computing Machinery, New York, NY, USA, Article 39, 1–9.

```bibtex
@inproceedings{10.1145/3658271.3658310,
  author = {Machado, Marcelo and Assis, Elias Cyrino and Souza, Jairo Francisco and Siqueira, Sean Wolfgand Matsui},
  title = {A framework to support experimentation in the context of Cognitive Biases in Search as a Learning process},
  year = {2024},
  isbn = {9798400709968},
  publisher = {Association for Computing Machinery},
  address = {New York, NY, USA},
  url = {https://doi.org/10.1145/3658271.3658310},
  doi = {10.1145/3658271.3658310},
  abstract = {Context: Information seeking plays a key role in the learning process, enabling individuals to acquire knowledge and make well-informed decisions. However, this process is not exempt from cognitive biases that can distort the way we interpret and use available information. Ongoing research seeks to comprehend and mitigate these biases to enhance search efficacy and promote effective learning. Problem: Despite these efforts, existing empirical experimentation remain confined to isolated platforms, hindering reproducibility and collaborative progress within the field. This limitation underscores a critical need for a more unified approach to experimentation. Solution: In response, we propose a comprehensive framework designed to support and standardize experimentation. IS theory: Our approach aligns with Design Theory, establishing a connection between cognitive biases and the technical dimensions of the information system. Method: To define the requirements of the proposed framework, a thorough literature review on cognitive biases in search was conducted. The framework’s efficacy is demonstrated through a proof of concept. Summary of Results: We showcase the framework applicability by instantiating it with a study on confirmation bias within a health-related search task. This implementation is particularly relevant as it integrates crucial components and requirements identified in previous research. Contributions and Impact in IS area: Our proposed framework bridges a significant gap in the field by presenting a standardized approach to conducting experiments on information seeking and cognitive biases. This not only fortifies the reliability of individual studies but also fosters collaborative efforts, enabling a more profound understanding of information-seeking behaviors across diverse domains within the Information Systems community.},
  booktitle = {Proceedings of the 20th Brazilian Symposium on Information Systems},
  articleno = {39},
  numpages = {9},
  keywords = {Confirmation Bias, Heuristics, Interactive Information Retrieval, Search as Learning},
  location = {Juiz de Fora, Brazil},
  series = {SBSI '24}
}
```
