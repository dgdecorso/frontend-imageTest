describe("Add list element as user", () => {
  beforeEach(() => {
    // Mock Login-Request
    cy.intercept("POST", "/api/user/login", {
      statusCode: 200,
      body: {
        token: "fake-jwt",
        user: { id: 1, email: "admin@example.com" },
      },
    }).as("loginRequest");

    // Login-Seite aufrufen
    cy.visit("/login");
    cy.get("[data-cy=email]").type("admin@example.com");
    cy.get("[data-cy=password]").type("1234");
    cy.get("[data-cy=submit-login]").click();

    // Sicherstellen, dass der Login-Request abgefeuert wurde
    cy.wait("@loginRequest");
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
