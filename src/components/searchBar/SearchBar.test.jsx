import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "./SearchBar";

jest.mock("../../hooks/useSearchFilters", () => jest.fn());
jest.mock("../../hooks/useSearchResults", () => jest.fn());
jest.mock("../../hooks/useDropdownNavigation", () => jest.fn(() => () => {}));
jest.mock("../../hooks/useClickOutside", () => jest.fn());

const mockHandleSelect = jest.fn();
jest.mock("../../hooks/useSearchNavigation", () => ({
  __esModule: true,
  default: () => mockHandleSelect,
}));

import useSearchFilters from "../../hooks/useSearchFilters";
import useSearchResults from "../../hooks/useSearchResults";

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe("SearchBar component", () => {
  const mockSetSearchTerm = jest.fn();
  const mockSetShowDropdown = jest.fn();
  const mockSetSelectedIndex = jest.fn();

  const baseProps = {
    searchTerm: "",
    setSearchTerm: mockSetSearchTerm,
    showDropdown: true,
    setShowDropdown: mockSetShowDropdown,
    selectedIndex: -1,
    setSelectedIndex: mockSetSelectedIndex,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders search input and button", () => {
    useSearchFilters.mockReturnValue({
      filteredMusicians: [],
      filteredWorks: [],
      filteredWritings: [],
      filteredOccupations: [],
    });

    useSearchResults.mockReturnValue({
      totalResults: [],
      noResults: false,
    });

    render(<SearchBar {...baseProps} />);

    expect(screen.getByPlaceholderText(/enter name or keyword/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  test("displays dropdown items when results exist", () => {
    const mockResults = [
      { firstName: "Paul", surname: "Hindemith", sys: { id: "1" } },
      { title: "Music and Time", sys: { id: "2" } },
    ];

    useSearchFilters.mockReturnValue({
      filteredMusicians: [mockResults[0]],
      filteredWorks: [],
      filteredWritings: [mockResults[1]],
      filteredOccupations: [],
    });

    useSearchResults.mockReturnValue({
      totalResults: mockResults,
      noResults: false,
    });

    render(<SearchBar {...baseProps} searchTerm="music" />);

    expect(screen.getByText("Paul Hindemith")).toBeInTheDocument();
    expect(screen.getByText("Music and Time")).toBeInTheDocument();
  });

  test("calls setSearchTerm and setShowDropdown on input change", () => {
    useSearchFilters.mockReturnValue({
      filteredMusicians: [],
      filteredWorks: [],
      filteredWritings: [],
      filteredOccupations: [],
    });

    useSearchResults.mockReturnValue({
      totalResults: [],
      noResults: false,
    });

    render(<SearchBar {...baseProps} />);

    fireEvent.change(screen.getByPlaceholderText(/enter name or keyword/i), {
      target: { value: "Ligeti" },
    });

    expect(mockSetSearchTerm).toHaveBeenCalledWith("Ligeti");
    expect(mockSetShowDropdown).toHaveBeenCalledWith(true);
  });

  test("displays no results warning if no matches found", () => {
    useSearchFilters.mockReturnValue({
      filteredMusicians: [],
      filteredWorks: [],
      filteredWritings: [],
      filteredOccupations: [],
    });

    useSearchResults.mockReturnValue({
      totalResults: [],
      noResults: true,
    });

    render(<SearchBar {...baseProps} />);

    expect(screen.getByText(/no matches found/i)).toBeInTheDocument();
  });

  test("disables search button when searchTerm is empty", () => {
    useSearchFilters.mockReturnValue({
      filteredMusicians: [],
      filteredWorks: [],
      filteredWritings: [],
      filteredOccupations: [],
    });

    useSearchResults.mockReturnValue({
      totalResults: [],
      noResults: false,
    });

    render(<SearchBar {...baseProps} searchTerm="" />);

    expect(screen.getByRole("button", { name: /search/i })).toBeDisabled();
  });

  test('displays error message when submitting with no results', () => {
    useSearchFilters.mockReturnValue({
      filteredMusicians: [],
      filteredWorks: [],
      filteredWritings: [],
      filteredOccupations: [],
    });

    useSearchResults.mockReturnValue({
      totalResults: [],
      noResults: true,
    });

    render(<SearchBar {...baseProps} searchTerm="notfound" />);

    const button = screen.getByRole("button", { name: /search/i });
    fireEvent.click(button);

    expect(screen.getByText(/No results to show for "notfound"/i)).toBeInTheDocument();
  });

  test("search button selects first result when results exist", () => {
    const mockResults = [{ firstName: "Claude", surname: "Debussy", sys: { id: "1" } }];

    useSearchFilters.mockReturnValue({
      filteredMusicians: mockResults,
      filteredWorks: [],
      filteredWritings: [],
      filteredOccupations: [],
    });

    useSearchResults.mockReturnValue({
      totalResults: mockResults,
      noResults: false,
    });

    render(<SearchBar
      {...baseProps}
      searchTerm="debussy"
      selectedIndex={0}
    />);

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(mockHandleSelect).toHaveBeenCalledWith(mockResults[0]);
  });
});
