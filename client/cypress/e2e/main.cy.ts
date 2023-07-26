// import { LIST_TYPE } from '../fixtures/type';
import items from "../fixtures/example.json";

describe("마켓보로 애플리케이션 테스트", () => {
  const getFirstProduct = () => {
    cy.visit("http://localhost:3000/auth/login");
    cy.get('[data-cy="todolist_email_input"]').type("test123@naver.com");
    cy.get('[data-cy="todolist_password_input"]').type("test1234");
    cy.get('[data-cy="todolist_login_button"]').click();
  };

  beforeEach(() => {
    cy.viewport(1600, 1080);
    cy.intercept("GET", "http://localhost:8080/todos", {
      statusCode: 200,
      body: {
        data: items,
      },
    }).as("getData");

    cy.intercept("POST", "http://localhost:8080/todos", {
      statusCode: 200,
      body: {
        message: "post api success",
      },
    }).as("postData");

    getFirstProduct();
  });

  it("로그인이 정상적으로 됩니다.", () => {
    console.log();

    cy.url().should("eq", "http://localhost:3000/todo");
    cy.window().then((win) => {
      const token = win.localStorage.getItem("token");
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(token).to.be.ok;
    });
  });

  it("리스트가 정상적으로 추가됩니다.", () => {
    cy.visit("http://localhost:3000/todo");

    cy.get('[data-cy="todolist_input_title"]').type("테스트 제목입니다.");
    cy.get('[data-cy="todolist_textarea_content"]').type("테스트 내용입니다.");
    cy.get('[data-cy="todolist_add_button"]').click();

    cy.wait("@postData").then((interception: any) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property(
        "message",
        "post api success",
      );
    });
  });
});
