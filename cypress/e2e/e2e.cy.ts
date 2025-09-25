describe("Add list element as user", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get("[data-cy=email]").type("admin@example.com");
    cy.get("[data-cy=password]").type("1234");
    cy.get("[data-cy=submit-login]").click();

    cy.request("POST", "http://localhost:8080/user/login", {
      email: "admin@example.com",
      password: "1234",
    });
  });

  it("Should create a new list element successfully", () => {
    cy.get("[data-cy=newPost]").click();
    cy.get("[data-cy=description]").type("1234");
    cy.get("[data-cy=imageUrl]").type(
      "https://noseryoung.ch/wp-content/uploads/2024/08/Felipe_Andres_Pereira_klein.jpg"
    );
    cy.get("[data-cy=submit]").click();

    cy.get("[data-cy=addListElement]").click();
    cy.get("[data-cy=title]").type("My Test Title");
    cy.get("[data-cy=text]").type("This is a test description.");
    cy.get("[data-cy=select]").click();
    cy.get('li[data-value="HIGH"]').click();

    cy.get("[data-cy=submit]").click();

    cy.contains("My Test Title").should("be.visible");
  });
});
