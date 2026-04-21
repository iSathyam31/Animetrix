from typing_extensions import TypedDict


class ComparisonState(TypedDict):
    """
    State for the Anime Comparison module.
    Passed through to runner.compare() as input context.
    """

    subject_a: str  # First anime name
    subject_b: str  # Second anime name
