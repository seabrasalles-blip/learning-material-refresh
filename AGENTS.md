# Architecture rules

- Preserve TanStack file routing and existing Akemi/SVG components rather than replacing the application.
- Keep original figure coordinates immutable; derive each challenge's model and target through explicit uniform transformations, so all geometry shares one mathematical mapping.
- Validate line coverage with merged collinear intervals, not segment counts, so subdivision and drawing direction do not affect correctness.
- Keep fixed circles separate from student segment state, so drawing tools cannot delete supplied geometry.
- Remember demonstration viewing only for the current browser session; this is presentation state, not stored student progress.