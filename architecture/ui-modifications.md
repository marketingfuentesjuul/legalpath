# SOP: UI Modifications (Stylize Phase)

## Goal
Explain the protocol for modifying the frontend of the LegalPath landing page to ensure consistency and high-quality design.

## Inputs
- User UI request (e.g., adding sections, changing colors).
- Existing `index.html` structure.
- Tailwind CSS configuration.

## Tool Logic
1. **Research**: Locate the HTML section in `index.html` using comments or IDs.
2. **Design Alignment**: Ensure the request aligns with the "Stylize" rules in `gemini.md` (curated color palettes, premium animations).
3. **Execution**:
   - Use Tailwind CSS classes for styling.
   - Use horizontal rules or separators to group files by component.
   - For new sections, ensure semantic HTML (e.g., `<h2>` for section titles).
4. **Verification**:
   - Validate the layout in the browser.
   - Check responsiveness (mobile/desktop).

## Edge Cases
- **Color Mismatch**: If the user requests a color not in the brand, propose a close match from the `tailwind.config` or define a new specialized color.
- **Breaking Layout**: Ensure that absolute-positioned elements (like floating cards) don't overlap with new content.
