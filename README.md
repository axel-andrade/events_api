# Clean Architecture with Typescript
Este repositório fornece uma implementação da Arquitetura Limpa baseada nos artigos do Filipe Mata (https://filipemata.medium.com).


![CleanArchitecture](https://user-images.githubusercontent.com/10949632/92665934-3390a380-f2de-11ea-8c63-5447e5773e2d.jpg)

- **entities**: esta pasta contém todas as regras de negócios da empresa. É representado por classes de domínio com regras de negócios mais críticas.
- **use-cases**: esta pasta contém todas as regras de negócios de aplicação. É encapsulado em módulos contendo os interactors de caso de uso e suas portas (uma interface de gateway de caso de uso específico e / ou uma interface de apresentador de caso de uso específico)
- **adapters**: esta pasta contém todo o tipo de código que adapta as interfaces mais familiares à camada de infraestrutura às interfaces mais familiares da camada de caso de uso. Por exemplo, às vezes é necessário adaptar uma ou mais classes de acesso a dados a uma interface de gateway de caso de uso específico.
- **infra**: esta pasta contém todas as bibliotecas, frameworks e drivers necessários para a aplicação. É a camada de aplicação mais suja e menos importante, dependendo sempre da camada de adaptadores.
- **shared**: esta pasta contém funçoes auxiliares, padrões e objetos usados por toda a aplicação. É importante dizer que cada código dentro dessa pasta é totalmente independente dos detalhes de implementação.


# Comandos: 
## Migration: 
- create: npm run migration:create -- --name=MIGRATION_NAME
- run: npm run migration:run -- --env=DATABASE_ENV